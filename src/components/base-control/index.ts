import { defineClass } from '../../decorators/defineClass.js'
import { attachShadow } from '../../decorators/shadow.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { Component } from '../Component.js'
import { append, mountBefore } from '../../common/mount.js'
import { strSetter } from '../../common/property.js'

export interface Control extends Component {
  _ref: {
    $layout: HTMLDivElement
  }
}

@defineClass
@attachShadow({
  mode: 'open',
  // 代理焦点，
  // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
  // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
  // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
  delegatesFocus: true,
})
export class Control extends Component {
  @attr('boolean')
  accessor disabled!: boolean

  @domRef('#layout')
  accessor $layout!: HTMLDivElement

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    const $layout = document.createElement('div')
    $layout.id = 'layout'

    this._ref = {
      $layout: shadowRoot.appendChild($layout),
    }
  }

  // 配置组件的可聚焦性
  // 子类根据需要在 `constructor` 中初始化改属性
  //
  // 1. 默认为字符串 `'-1'`，效果为组件可以点击聚焦，但不能 tab 聚焦。
  // 该行为适用于组件子孙元素本身有需要聚焦的 input、button 之类的元素，
  // tab 的时候希望直接聚焦到这些内部控件，而不是组件自身的场景。
  //
  // 2. 如果子孙元素没有其他可聚焦的控件，而组件本身又需要可以 tab 聚焦，则可以在组件构造的时候，初始化当前值为字符串 `0` 或正数字符串。
  //
  // 3. 如果组件自身没有可聚焦的子孙元素，且需要禁用聚焦，则在 `constructor` 中将该属性设置为 `null` 即可。
  #internalTabIndex: `${number}` | null = '-1'
  get internalTabIndex() {
    return this.#internalTabIndex
  }

  set internalTabIndex(value: `${number}` | null) {
    this.#internalTabIndex = value
    this._renderDisabled()
  }

  _renderDisabled() {
    if (this.disabled || this.internalTabIndex == null) {
      this.setAttribute('aria-disabled', 'true')
      strSetter('tabindex')(this._ref.$layout, null)
    } else {
      strSetter('tabindex')(this._ref.$layout, this.internalTabIndex)
      this.setAttribute('aria-disabled', 'false')
    }
  }

  _appendStyle($style: HTMLStyleElement) {
    mountBefore($style, this._ref.$layout)
  }

  _appendContent<T extends HTMLElement | DocumentFragment>($el: T) {
    append($el, this._ref.$layout)
    return $el
  }

  override render() {
    this._renderDisabled()
  }

  override connectedCallback() {
    super.connectedCallback()
    this._renderDisabled()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'disabled') {
      this._renderDisabled()
    }
  }
}
