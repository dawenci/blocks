import type { BlCloseButton } from '../close-button/index.js'
import type { BlComponentEventListener } from '../component/Component.js'
import type { BlControlBoxEventMap } from '../base-control-box/index.js'
import '../close-button/index.js'
import { attr } from '../../decorators/attr/index.js'
import { clearTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { unmount } from '../../common/mount.js'
import { BlControlBox } from '../base-control-box/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

export interface BlClearableControlBoxEventMap extends BlControlBoxEventMap {
  'click-clear': CustomEvent
}

export interface BlClearableControlBox extends BlControlBox {
  addEventListener<K extends keyof BlClearableControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlClearableControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlClearableControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlClearableControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

/**
 * 可 clear 的控件基类
 */
@defineClass({
  styles: [style],
})
export class BlClearableControlBox extends BlControlBox {
  @attr('boolean') accessor clearable!: boolean

  @shadowRef('[part="clear"]', false) accessor $clear!: BlCloseButton

  constructor() {
    super()
    this.#setupClearableFeature()
    this._disabledFeature.withTarget(() => [this, this.$clear])
  }

  _emptyFeature = SetupEmpty.setup({
    component: this,
    // 子类通过 `this._emptyFeature.withIsEmpty(checkFn)` 设置自己的逻辑
    predicate() {
      return true
    },
    // 子类通过 `this._emptyFeature.withGetTarget(getFn)` 设置自己的逻辑
    target() {
      return this.$layout
    },
    init() {
      const render = () => {
        // 组件中的 click-clear 逻辑触发总是比此处晚，
        // 因此此处延迟 render 以尽量确保生效（当然是否生效取决于组件中是否更晚执行清空逻辑）
        queueMicrotask(() => {
          this._emptyFeature.update()
        })
      }
      this.hook.onConnected(() => {
        this.addEventListener('click-clear', render)
      })
      this.hook.onDisconnected(() => {
        this.removeEventListener('click-clear', render)
      })
    },
  })

  #setupClearableFeature() {
    const render = () => {
      this.$layout.classList.toggle('with-clear', this.clearable)
      if (this.clearable) {
        if (!this.$clear) {
          const onClickClear = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (this.$clear && this.$clear.contains(target)) {
              dispatchEvent(this, e.type === 'mousedown' ? 'mousedown-clear' : 'click-clear')
              return
            }
          }
          const $clearButton = clearTemplate()
          $clearButton.addEventListener('mousedown', onClickClear)
          $clearButton.addEventListener('click', onClickClear)
          this.$layout.append($clearButton)
        }
      } else {
        if (this.$clear) {
          unmount(this.$clear)
        }
      }
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('clearable', render)
  }

  override appendContent<T extends HTMLElement | DocumentFragment>($el: T) {
    const $last = this.$suffix ?? this.$clear
    if ($last) {
      this.$layout.insertBefore($el, $last)
    } else {
      this.$layout.appendChild($el)
    }
    return $el
  }

  override _renderSuffixIcon() {
    super._renderSuffixIcon()
    // 确保 clear 在最后
    if (this.$clear) {
      this.$layout.appendChild(this.$clear)
    }
  }
}
