import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { onDragMove } from '../../common/onDragMove.js'
import { round } from '../../common/utils.js'
import { setStyles } from '../../common/style.js'
import { strGetter, strSetter } from '../../common/property.js'
import { style } from './style.js'
import { template } from './template.js'
import { Control } from '../base-control/index.js'

export interface BlocksRangeSlider extends Control {
  ref: {
    $layout: HTMLElement
    $track: HTMLElement
    $trackBg: HTMLElement
    $point: HTMLButtonElement
    $point2: HTMLButtonElement
    $range: HTMLElement
  }
}

// TODO: 聚焦后，方向键调整值
@defineClass({
  customElement: 'bl-range-slider',
  styles: [style],
})
export class BlocksRangeSlider extends Control {
  static get role() {
    return 'slider'
  }

  static override get observedAttributes() {
    return ['step', 'value']
  }

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
  }

  @attr('intRange', { min: 1, max: 10 }) accessor shadowSize = 2

  @attr('intRange', { min: 14, max: 100 }) accessor size = 14

  @attr('number') accessor min = 0

  @attr('number') accessor max = 100

  // TODO: 拖拽的时候，按照 step 增长
  @attr('number') accessor step = 1

  @attr('boolean') accessor vertical!: boolean

  @attr('int') accessor round = 2

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('#track') accessor $track!: HTMLElement
  @shadowRef('#track__bg') accessor $trackBg!: HTMLElement
  @shadowRef('.point1') accessor $point!: HTMLButtonElement
  @shadowRef('.point2') accessor $point2!: HTMLButtonElement
  @shadowRef('.line') accessor $range!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0).withTarget(() => {
      return [this.$point, this.$point2]
    })

    this.#setupDragEvents()
    this.onConnected(this.render)
    this.onAttributeChangedDep('value', () => {
      this.#renderPoint()
      this.#renderRangeLine()
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })
  }

  #dragging = false

  get value(): [number, number] {
    const attrValue = (strGetter('value')(this) ?? '').trim()
    const values = attrValue.split(',').map(n => parseFloat(n))
    return values.every(n => this.#validate(n))
      ? (values.sort((a, b) => a - b).map(n => round(n, this.round)) as [number, number])
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
    super.render()

    const { $layout, $point, $point2, $trackBg } = this
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
  }

  #renderPoint() {
    const pos1 = fromRatio(getRatio(this.value[0], this.min, this.max), this.#posMin(), this.#posMax())
    const pos2 = fromRatio(getRatio(this.value[1], this.min, this.max), this.#posMin(), this.#posMax())
    this.$point.style[this.vertical ? 'top' : 'left'] = `${pos1}px`
    this.$point2.style[this.vertical ? 'top' : 'left'] = `${pos2}px`
  }

  #renderRangeLine() {
    const p1 = this.#posMax() * getRatio(this.value[0], this.min, this.max)
    const p2 = this.#posMax() * getRatio(this.value[1], this.min, this.max)
    if (this.vertical) {
      this.$range.style.top = p1 + this.size / 2 + 'px'
      this.$range.style.height = p2 - p1 + 'px'
    } else {
      this.$range.style.left = p1 + this.size / 2 + 'px'
      this.$range.style.width = p2 - p1 + 'px'
    }
  }

  #setupDragEvents() {
    this.#dragging = false
    let positionStart: number | undefined
    let $active: HTMLButtonElement | undefined

    const update = (pos: number) => {
      if ($active === this.$point) {
        this.value = [fromRatio(getRatio(pos, this.#posMin(), this.#posMax()), this.min, this.max), this.value[1]]
      } else {
        this.value = [this.value[0], fromRatio(getRatio(pos, this.#posMin(), this.#posMax()), this.min, this.max)]
      }
    }

    let clear: (() => void) | undefined
    const bindEvent = () => {
      clear = onDragMove(this.$track, {
        onStart: ({ start, $target, stop }) => {
          if (this.disabled) {
            stop()
            return
          }
  
          // 点击轨道，则一次性移动滑块
          if ($target === this.$track) {
            const rect = this.$track.getBoundingClientRect()
            if (this.vertical) {
              positionStart = this.#trackSize() - (start.clientY - rect.y) - 7
            } else {
              positionStart = start.clientX - rect.x - 7
            }
  
            // 则需要确定移动哪个控制点
            // 1. 点击的是 min 点的左侧，则移动 min 点
            // 2. 点击的是 max 点的右侧，则移动 max 点
            // 3. 点击的是两点之间，则移动接近点击位置的那个点
            const pos1 = getPosition(this.$point, this.vertical)
            const pos2 = getPosition(this.$point2, this.vertical)
            const min = Math.min(pos1, pos2)
            const max = Math.max(pos1, pos2)
            $active =
              positionStart < min
                ? this.$point
                : positionStart > max
                ? this.$point2
                : Math.abs(max - positionStart) > Math.abs(positionStart - min)
                ? this.$point
                : this.$point2
  
            update(positionStart)
  
            positionStart = undefined
            $active = undefined
            this.#dragging = false
            return stop()
          }
  
          // 点击的是滑块，记录移动初始信息
          if ($target === this.$point || $target === this.$point2) {
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
  
          if ($active === this.$point && position > getPosition(this.$point2, this.vertical)) {
            this.$point.classList.remove('active')
            this.$point.blur()
            this.$point2.classList.add('active')
            this.$point2.focus()
            $active = this.$point2
          } else if ($active === this.$point2 && position < getPosition(this.$point, this.vertical)) {
            this.$point2.classList.remove('active')
            this.$point2.blur()
            this.$point.classList.add('active')
            this.$point.focus()
            $active = this.$point
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
    this.onConnected(() => {
      bindEvent()
    })
    this.onDisconnected(() => {
      if (clear) {
        clear()
        clear = undefined
      }
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
    return parseFloat(getComputedStyle(this.$track).getPropertyValue(this.vertical ? 'height' : 'width'))
  }

  // override _renderTabIndex() {
  //   if (this.disabled || this.internalTabIndex == null) {
  //     strSetter('tabindex')(this.$point, null)
  //     strSetter('tabindex')(this.$point2, null)
  //   } else {
  //     strSetter('tabindex')(this.$point, this.internalTabIndex)
  //     strSetter('tabindex')(this.$point2, this.internalTabIndex)
  //   }
  // }
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
