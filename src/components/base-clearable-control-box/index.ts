import {
  clearableGetter,
  clearableSetter,
} from '../../common/propertyAccessor.js'
import { ComponentEventListener } from '../Component.js'
import { ControlBox, ControlBoxEventMap } from '../base-control-box/index.js'
import { clearTemplate, styleTemplate } from './template.js'
import { dispatchEvent } from '../../common/event.js'
import { unmount } from '../../common/mount.js'

export interface ClearableControlBoxEventMap extends ControlBoxEventMap {
  'click-clear': CustomEvent
}

export interface ClearableControlBox extends ControlBox {
  _ref: ControlBox['_ref'] & { $clear?: HTMLButtonElement }

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

export abstract class ClearableControlBox extends ControlBox {
  static override get observedAttributes() {
    return super.observedAttributes.concat(['clearable'])
  }

  constructor() {
    super()
    this._appendStyle(styleTemplate())

    this._ref.$layout.addEventListener('click', e => {
      const target = e.target as HTMLElement
      if (this._ref.$clear && this._ref.$clear.contains(target)) {
        dispatchEvent(this, 'click-clear')
        this._renderEmpty()
        return
      }
    })
  }

  get clearable() {
    return clearableGetter(this)
  }

  set clearable(value) {
    clearableSetter(this, value)
  }

  // 检测内容是否为空，子类覆盖该实现
  _isEmpty() {
    return true
  }

  override _appendContent<T extends HTMLElement | DocumentFragment>($el: T) {
    const $target = this._ref.$suffix ?? this._ref.$clear
    if ($target) {
      this._ref.$layout.insertBefore($el, $target)
    } else {
      this._ref.$layout.appendChild($el)
    }
    return $el
  }

  override _renderSuffixIcon() {
    super._renderSuffixIcon()
    // 确保 clear 在最后
    if (this._ref.$clear) {
      this._ref.$layout.appendChild(this._ref.$clear)
    }
  }

  // 如果内容为空，则渲染 empty class
  _renderEmpty() {
    this._ref.$layout.classList.toggle('empty', this._isEmpty())
  }

  _renderClearable() {
    this._ref.$layout.classList.toggle('with-clear', this.clearable)
    if (this.clearable) {
      if (!this._ref.$clear) {
        const $clearButton = (this._ref.$clear = clearTemplate())
        this._ref.$layout.append($clearButton)
      }
    } else {
      if (this._ref.$clear) {
        unmount(this._ref.$clear)
        this._ref.$clear = undefined
      }
    }
  }

  override render() {
    super.render()
    this._renderEmpty()
    this._renderClearable()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'clearable') {
      this._renderClearable()
    }
  }
}
