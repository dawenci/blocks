import { strGetter, strSetter } from '../../common/property.js'
import { forEach, round } from '../../common/utils.js'
import { dispatchEvent } from '../../common/event.js'
import { onDragMove } from '../../common/onDragMove.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { setStyles } from '../../common/style.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksRangeSlider extends Component {
  ref: {
    $layout: HTMLElement
    $track: HTMLElement
    $trackBg: HTMLElement
    $point: HTMLButtonElement
    $point2: HTMLButtonElement
    $range: HTMLElement
  }
}

@defineClass({
  customElement: 'bl-range-slider',
})
export class BlocksRangeSlider extends Component {
  static get role() {
    return 'slider'
  }

  static override get observedAttributes() {
    return [
      'disabled',
      'max',
      'min',
      'size',
      'step',
      'round',
      'value',
      'vertical',
    ]
  }

  @attr('intRange', { min: 1, max: 10 }) accessor shadowSize = 2

  @attr('intRange', { min: 14, max: 100 }) accessor size = 14

  @attr('number') accessor min = 0

  @attr('number') accessor max = 100

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor vertical!: boolean

  @attr('int') accessor round = 2

  constructor() {
    super()

    const { comTemplate, cssTemplate } = template()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))
    const $layout = shadowRoot.getElementById('layout')!
    const $track = shadowRoot.getElementById('track')!
    const $trackBg = shadowRoot.getElementById('track__bg')!
    const $point = shadowRoot.querySelector('.point1') as HTMLButtonElement
    const $point2 = shadowRoot.querySelector('.point2') as HTMLButtonElement
    const $range = shadowRoot.querySelector('.line') as HTMLElement

    this.ref = {
      $layout,
      $track,
      $point,
      $point2,
      $range,
      $trackBg,
    }
  }

  #dragging = false

  get value(): [number, number] {
    const attrValue = (strGetter('value')(this) ?? '').trim()
    const values = attrValue.split(',').map(n => parseFloat(n))
    return values.every(n => this.#validate(n))
      ? (values.sort((a, b) => a - b).map(n => round(n, this.round)) as [
          number,
          number
        ])
      : ([this.min, this.min] as [number, number])
  }

  set value(value: [number, number]) {
    if (!Array.isArray(value)) return
    if (value.some(n => !this.#validate(n))) return
    if (value.every((n, i) => n === this.value[i])) return
    strSetter('value')(
      this,
      value
        .slice()
        .map(n => round(n, this.round))
        .sort((a, b) => a - b)
        .join(',')
    )
  }

  override render() {
    const { $layout, $point, $point2, $trackBg } = this.ref
    const layoutSize = this.size + this.shadowSize * 2
    const layoutPadding = this.shadowSize
    const trackSize = this.size / 4 >= 2 ? this.size / 4 : 2

    $layout.style.padding = layoutPadding + 'px'
    $point.style.width = $point.style.height = this.size + 'px'
    $point2.style.width = $point.style.height = this.size + 'px'

    if (this.vertical) {
      setStyles($layout, {
        width: layoutSize + 'px',
        height: '100%',
      })
      setStyles($trackBg, {
        width: `${trackSize}px`,
        height: 'auto',
        right: '0',
        top: `${this.size / 2}px`,
        bottom: `${this.size / 2}px`,
      })
    } else {
      setStyles($layout, {
        height: layoutSize + 'px',
        width: 'auto',
      })
      setStyles($trackBg, {
        height: `${trackSize}px`,
        width: 'auto',
        top: '0',
        left: `${this.size / 2}px`,
        right: `${this.size / 2}px`,
      })
    }

    this.#renderPoint()
    this.#renderRangeLine()
    this._renderDisabled()
  }

  _renderDisabled() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.setAttribute('aria-disabled', 'false')
    }
  }

  #renderPoint() {
    const pos1 = fromRatio(
      getRatio(this.value[0], this.min, this.max),
      this.#posMin(),
      this.#posMax()
    )
    const pos2 = fromRatio(
      getRatio(this.value[1], this.min, this.max),
      this.#posMin(),
      this.#posMax()
    )
    this.ref.$point.style[this.vertical ? 'top' : 'left'] = `${pos1}px`
    this.ref.$point2.style[this.vertical ? 'top' : 'left'] = `${pos2}px`
  }

  #renderRangeLine() {
    const p1 = this.#posMax() * getRatio(this.value[0], this.min, this.max)
    const p2 = this.#posMax() * getRatio(this.value[1], this.min, this.max)
    if (this.vertical) {
      this.ref.$range.style.top = p1 + 'px'
      this.ref.$range.style.height = p2 - p1 + 'px'
    } else {
      this.ref.$range.style.left = p1 + 'px'
      this.ref.$range.style.width = p2 - p1 + 'px'
    }
  }

  #clearDragEvents?: () => void
  override connectedCallback() {
    super.connectedCallback()
    this._renderDisabled()
    this.#updateTabindex()

    this.render()
    this.#clearDragEvents = this.#initDragEvents()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.#clearDragEvents) this.#clearDragEvents()
    this.ref.$layout.onmousedown = null
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'disabled') {
      this._renderDisabled()
      this.#updateTabindex()
    }

    if (attrName === 'value') {
      this.#renderPoint()
      this.#renderRangeLine()
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }
  }

  #initDragEvents() {
    this.#dragging = false
    let positionStart: number | undefined
    let $active: HTMLButtonElement | undefined

    const update = (pos: number) => {
      if ($active === this.ref.$point) {
        this.value = [
          fromRatio(
            getRatio(pos, this.#posMin(), this.#posMax()),
            this.min,
            this.max
          ),
          this.value[1],
        ]
      } else {
        this.value = [
          this.value[0],
          fromRatio(
            getRatio(pos, this.#posMin(), this.#posMax()),
            this.min,
            this.max
          ),
        ]
      }
    }

    return onDragMove(this.ref.$track, {
      onStart: ({ start, $target, stop }) => {
        if (this.disabled) {
          stop()
          return
        }

        // 点击轨道，则一次性移动滑块
        if ($target === this.ref.$track) {
          const rect = this.ref.$track.getBoundingClientRect()
          if (this.vertical) {
            positionStart = this.#trackSize() - (start.clientY - rect.y) - 7
          } else {
            positionStart = start.clientX - rect.x - 7
          }

          // 则需要确定移动哪个控制点
          // 1. 点击的是 min 点的左侧，则移动 min 点
          // 2. 点击的是 max 点的右侧，则移动 max 点
          // 3. 点击的是两点之间，则移动接近点击位置的那个点
          const pos1 = getPosition(this.ref.$point, this.vertical)
          const pos2 = getPosition(this.ref.$point2, this.vertical)
          const min = Math.min(pos1, pos2)
          const max = Math.max(pos1, pos2)
          $active =
            positionStart < min
              ? this.ref.$point
              : positionStart > max
              ? this.ref.$point2
              : Math.abs(max - positionStart) > Math.abs(positionStart - min)
              ? this.ref.$point
              : this.ref.$point2

          update(positionStart)

          positionStart = undefined
          $active = undefined
          this.#dragging = false
          return stop()
        }

        // 点击的是滑块，记录移动初始信息
        if ($target === this.ref.$point || $target === this.ref.$point2) {
          this.#dragging = true
          $active = $target as HTMLButtonElement
          $active.classList.add('active')
          positionStart = getPosition($active, this.vertical)
          return
        }
      },

      onMove: ({ offset, preventDefault }) => {
        preventDefault()
        const moveOffset = this.vertical ? -offset.y : offset.x
        const position = positionStart! + moveOffset

        if (
          $active === this.ref.$point &&
          position > getPosition(this.ref.$point2, this.vertical)
        ) {
          this.ref.$point.classList.remove('active')
          this.ref.$point.blur()
          this.ref.$point2.classList.add('active')
          this.ref.$point2.focus()
          $active = this.ref.$point2
        } else if (
          $active === this.ref.$point2 &&
          position < getPosition(this.ref.$point, this.vertical)
        ) {
          this.ref.$point2.classList.remove('active')
          this.ref.$point2.blur()
          this.ref.$point.classList.add('active')
          this.ref.$point.focus()
          $active = this.ref.$point
        }

        update(position)
      },

      onEnd: ({ offset }) => {
        const moveOffset = this.vertical ? -offset.y : offset.x
        const position = positionStart! + moveOffset
        update(position)

        $active!.classList.remove('active')
        positionStart = undefined
        $active = undefined
        this.#dragging = false
      },
    })
  }

  #validate(n: number) {
    return typeof n === 'number' && n === n && n >= this.min && n <= this.max
  }

  #posMin() {
    return 0
  }

  #posMax() {
    return this.#trackSize() - this.size
  }

  #trackSize() {
    return parseFloat(
      getComputedStyle(this.ref.$track).getPropertyValue(
        this.vertical ? 'height' : 'width'
      )
    )
  }

  #updateTabindex() {
    const $buttons = this.shadowRoot!.querySelectorAll('.point')
    if (this.disabled) {
      forEach($buttons, button => {
        button.removeAttribute('tabindex')
      })
    } else {
      forEach($buttons, button => {
        button.setAttribute('tabindex', '0')
      })
    }
  }
}

function getRatio(current: number, min: number, max: number) {
  const span = max - min
  const offset = current - min
  return offset / span
}

function fromRatio(ratio: number, min: number, max: number) {
  return ratio * (max - min) - min
}

function getPosition($point: HTMLButtonElement, vertical?: boolean) {
  return parseFloat($point.style[vertical ? 'top' : 'left']) || 0
}
