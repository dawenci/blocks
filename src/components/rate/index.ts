import type { BlComponentEventListener } from '../component/Component.js'
import type { BlControlEventMap } from '../base-control/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { forEach } from '../../common/utils.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControl } from '../base-control/index.js'

const halfValueGetter = enumGetter('value', ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'])
const halfValueSetter = enumSetter('value', ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'])
const valueGetter = enumGetter('value', ['0', '1', '2', '3', '4', '5'])
const valueSetter = enumSetter('value', ['0', '1', '2', '3', '4', '5'])

export interface BlRateEventMap extends BlControlEventMap {
  change: CustomEvent<{ value: number }>
}

export interface BlRate extends BlControl {
  addEventListener<K extends keyof BlRateEventMap>(
    type: K,
    listener: BlComponentEventListener<BlRateEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlRateEventMap>(
    type: K,
    listener: BlComponentEventListener<BlRateEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-rate',
  styles: [style],
})
export class BlRate extends BlControl {
  @attr('number', {
    get(self) {
      if (self.resultMode) return +self.getAttribute('value')
      const value = self.half ? halfValueGetter(self) : valueGetter(self)
      if (value == null) return 0
      return +value
    },

    set(self, value) {
      if (self.resultMode) {
        self.setAttribute('value', value)
      }
      if (self.half) {
        halfValueSetter(self, String(value))
      } else {
        valueSetter(self, String(value))
      }
    },
  })
  accessor value!: number

  /** 允许选择半颗星 */
  @attr('boolean') accessor half!: boolean

  /** 结果模式，可以百分比高亮星星 */
  @attr('boolean') accessor resultMode!: boolean

  @shadowRef('#layout') accessor $layout!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this._disabledFeature.withDisableEventTypes(['click', 'mousedown', 'focus', 'mouseover', 'mouseleave', 'keydown'])
    this._tabIndexFeature.withTarget(() => [this.$layout]).withTabIndex(0)

    this.#setupEvents()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)

    this.hook.onAttributeChangedDep('value', () => {
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })
  }

  #hoverValue?: number
  get hoverValue() {
    return this.#hoverValue
  }

  set hoverValue(value) {
    this.#hoverValue = value
    this.render()
  }

  override render() {
    if (this.resultMode) {
      this.#renderResult()
    } else {
      this.#renderSelection()
    }
  }

  #setupEvents() {
    const getElContainsTarget = <T extends HTMLElement>(e: MouseEvent, tagName: string): T | null => {
      let $el = e.target as Element | null
      while ($el && $el !== this.$layout) {
        if ($el.tagName === tagName) {
          return $el as T
        }
        $el = $el.parentElement
      }
      return null
    }

    const getValue = (e: MouseEvent) => {
      const $button = getElContainsTarget(e, 'BUTTON')!
      if (!this.half) return Number($button.dataset.value)
      const $star = getElContainsTarget(e, 'SPAN')!
      return Number($button.dataset.value) - ($star.classList.contains('part') ? 0.5 : 0)
    }

    const onMouseOver = (e: MouseEvent) => {
      if (this.resultMode) return
      const $button = getElContainsTarget(e, 'BUTTON')
      if (!$button) return
      this.hoverValue = getValue(e)
    }
    const onClick = (e: MouseEvent) => {
      if (this.resultMode) return
      const $button = getElContainsTarget(e, 'BUTTON')
      if (!$button) return
      this.value = getValue(e)
    }
    const onMouseLeave = () => {
      this.hoverValue = undefined
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (this.resultMode) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        if (this.value < 5) {
          this.value += this.half ? 0.5 : 1
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        if (this.value > 0) {
          this.value -= this.half ? 0.5 : 1
        }
      }
    }

    this.hook.onConnected(() => {
      this.$layout.addEventListener('keydown', onKeydown)
      this.$layout.addEventListener('mouseover', onMouseOver)
      this.$layout.addEventListener('click', onClick)
      this.$layout.addEventListener('mouseleave', onMouseLeave)
    })
    this.hook.onDisconnected(() => {
      this.$layout.removeEventListener('keydown', onKeydown)
      this.$layout.removeEventListener('mouseover', onMouseOver)
      this.$layout.removeEventListener('click', onClick)
      this.$layout.removeEventListener('mouseleave', onMouseLeave)
    })
  }

  #renderSelection() {
    const value = +(this.hoverValue ?? this.value ?? 0)
    let acc = 0
    forEach(this.$layout.children as unknown as HTMLButtonElement[], $button => {
      if (value - acc >= 1) {
        $button.className = 'selected'
        acc += 1
      } else if (value - acc === 0.5) {
        $button.className = 'partially-selected'
        ;($button.querySelector('.part') as HTMLElement).style.width = ''
        acc += 0.5
      } else {
        $button.className = ''
      }
    })
  }

  #renderResult() {
    const value = this.value ?? 0
    let acc = 0
    forEach(this.$layout.children as unknown as HTMLButtonElement[], $button => {
      if (value - acc >= 1) {
        $button.className = 'selected'
        acc += 1
      } else if (value - acc > 0) {
        $button.className = 'partially-selected'
        const n = value - acc
        ;($button.querySelector('.part') as HTMLElement).style.width = `${n * 100}%`
        acc += n
      } else {
        $button.className = ''
      }
    })
  }
}
