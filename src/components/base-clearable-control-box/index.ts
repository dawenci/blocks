import type { ComponentEventListener } from '../component/Component.js'
import type { ControlBoxEventMap } from '../base-control-box/index.js'
import { attr } from '../../decorators/attr.js'
import { clearTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { unmount } from '../../common/mount.js'
import { ControlBox } from '../base-control-box/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

export interface ClearableControlBoxEventMap extends ControlBoxEventMap {
  'click-clear': CustomEvent
}

export interface ClearableControlBox extends ControlBox {
  addEventListener<K extends keyof ClearableControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ClearableControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ClearableControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ClearableControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

/**
 * 可 clear 的控件基类
 */
@defineClass({
  styles: [style],
})
export class ClearableControlBox extends ControlBox {
  @attr('boolean') accessor clearable!: boolean

  @shadowRef('[part="clear"]', false) accessor $clear!: HTMLButtonElement

  constructor() {
    super()
    this.#setupClearableFeature()
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
        Promise.resolve().then(() => this._emptyFeature.update())
      }
      this.onConnected(() => {
        this.addEventListener('click-clear', render)
      })
      this.onDisconnected(() => {
        this.removeEventListener('click-clear', render)
      })
    },
  })

  #setupClearableFeature() {
    const onClickClear = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (this.$clear && this.$clear.contains(target)) {
        dispatchEvent(this, e.type === 'mousedown' ? 'mousedown-clear' : 'click-clear')
        return
      }
    }
    this.onRender(this._renderClearable)
    this.onConnected(() => {
      this._renderClearable()
      this.$layout.addEventListener('mousedown', onClickClear)
      this.$layout.addEventListener('click', onClickClear)
    })
    this.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClickClear)
    })
    this.onAttributeChangedDep('clearable', this._renderClearable)
  }
  _renderClearable() {
    this.$layout.classList.toggle('with-clear', this.clearable)
    if (this.clearable) {
      if (!this.$clear) {
        const $clearButton = clearTemplate()
        this.$layout.append($clearButton)
      }
    } else {
      if (this.$clear) {
        unmount(this.$clear)
      }
    }
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
