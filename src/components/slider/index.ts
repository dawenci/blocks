import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { numGetter, numSetter } from '../../common/property.js'
import { onDragMove } from '../../common/onDragMove.js'
import { round } from '../../common/utils.js'
import { setStyles } from '../../common/style.js'
import { style } from './style.js'
import { template } from './template.js'
import { Control } from '../base-control/index.js'

@defineClass({
  customElement: 'bl-slider',
  styles: [style],
})
export class BlocksSlider extends Control {
  static get role() {
    return 'slider'
  }

  static override get observedAttributes() {
    return ['disabled', 'max', 'min', 'size', 'step', 'round', 'value', 'vertical'] as const
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
  @shadowRef('#point') accessor $point!: HTMLButtonElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0).withTarget(() => {
      return [this.$point]
    })

    this.#setupDragEvents()

    this.onConnected(this.render)
    this.onAttributeChangedDep('size', this.render)
    this.onAttributeChangedDep('value', () => {
      this.#renderPoint()
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })

    this.$point.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault()
        this.value += this.step
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.value -= this.step
      }
    })
  }

  get value() {
    const value = numGetter('value')(this) ?? this.min
    return round(value, this.round)
  }

  set value(value) {
    if (!this.#validate(value) || this.value === value) return
    numSetter('value')(this, round(value, this.round))
  }

  override render() {
    super.render()

    const { $layout, $point, $trackBg } = this
    const layoutSize = this.size + this.shadowSize * 2
    const layoutPadding = this.shadowSize
    const trackSize = this.size / 4 >= 2 ? this.size / 4 : 2

    $layout.style.padding = layoutPadding + 'px'
    $point.style.width = $point.style.height = this.size + 'px'

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
  }

  #renderPoint() {
    const pos = fromRatio(getRatio(this.value, this.min, this.max), this.#posMin(), this.#posMax())
    this.$point.style[this.vertical ? 'top' : 'left'] = `${pos}px`
  }

  #dragging = false
  #setupDragEvents() {
    this.#dragging = false
    let positionStart: number | undefined

    let clear: () => void

    this.onConnected(() => {
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

            this.value = fromRatio(getRatio(positionStart, this.#posMin(), this.#posMax()), this.min, this.max)

            positionStart = undefined
            this.#dragging = false
            return stop()
          }

          // 点击的是滑块，记录移动初始信息
          if ($target === this.$point) {
            this.#dragging = true
            positionStart = getPosition(this.$point, this.vertical)
            return
          }
        },

        onMove: ({ offset, preventDefault }) => {
          preventDefault()
          const moveOffset = this.vertical ? -offset.y : offset.x

          const position = positionStart! + moveOffset
          this.value = fromRatio(getRatio(position, this.#posMin(), this.#posMax()), this.min, this.max)
        },

        onEnd: ({ offset }) => {
          const moveOffset = this.vertical ? -offset.y : offset.x
          const position = positionStart! + moveOffset
          this.value = fromRatio(getRatio(position, this.#posMin(), this.#posMax()), this.min, this.max)
          positionStart = undefined
          this.#dragging = false
        },
      })
    })

    this.onDisconnected(() => {
      clear()
    })
  }

  #validate(n: number) {
    return typeof n === 'number' && n === n && n >= this.min && n <= this.max
  }

  #trackSize() {
    return parseFloat(getComputedStyle(this.$track).getPropertyValue(this.vertical ? 'height' : 'width'))
  }

  #posMin() {
    return 0
  }

  #posMax() {
    return this.#trackSize() - this.size
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
