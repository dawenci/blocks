import {
  append,
  mountAfter,
  mountBefore,
  prepend,
  unmount,
} from '../common/mount.js'
import { upgradeProperty } from '../common/upgradeProperty.js'

interface ComponentEventListenerCallback<E extends Event = Event> {
  (evt: E): void
}

interface ComponentEventListenerObject<E extends Event = Event> {
  handleEvent(object: E): void
}

export type ComponentEventListener<E extends Event = Event> =
  | ComponentEventListenerCallback<E>
  | ComponentEventListenerObject<E>

export interface ComponentEventMap extends HTMLElementEventMap {
  [other: string]: Event
}

export interface Component extends HTMLElement {
  addEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: ComponentEventListener<ComponentEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: ComponentEventListener<ComponentEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export abstract class Component extends HTMLElement {
  /**
   * 附加到 DOM 的时候，自动执行属性 upgrade
   */
  connectedCallback() {
    this.initRole()
    this.upgradeProperty()
  }

  /**
   * 从 DOM 中脱离
   */
  disconnectedCallback() {
    //
  }

  /**
   * 跨文档移动 DOM
   */
  adoptedCallback(): void {
    //
  }

  /**
   * attribute 变化处理
   */
  attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ): void {
    //
  }

  /**
   * 渲染逻辑
   */
  render() {
    // render method
  }

  prependTo($parent: Node) {
    prepend(this, $parent)
  }

  appendTo($parent: Node) {
    append(this, $parent)
  }

  mountBefore($sibling: Node) {
    mountBefore(this, $sibling)
  }

  mountAfter($sibling: Node) {
    mountAfter(this, $sibling)
  }

  unmount() {
    unmount(this)
  }

  appendShadowChildren(nodes: ArrayLike<Node>) {
    if (this.shadowRoot) {
      for (let i = 0; i < nodes.length; i += 1) {
        this.shadowRoot.appendChild(nodes[i])
      }
    }
  }

  appendChildren(nodes: ArrayLike<Node>) {
    for (let i = 0; i < nodes.length; i += 1) {
      this.appendChild(nodes[i])
    }
  }

  /**
   * 对指定 attribute 对应的 property 执行 upgrade 逻辑
   */
  upgradeProperty(attrs?: string[]) {
    if (!attrs) {
      attrs = ((this.constructor as any).observedAttributes as string[]) ?? []
    }
    attrs.forEach(attr => {
      upgradeProperty(this, attr)
    })
  }

  initRole() {
    const role = (this.constructor as any).role
    if (role) {
      this.setAttribute('role', role)
    }
  }

  /**
   * 选择宿主元素下的元素
   */
  querySelectorHost<T extends Element>(selector: string) {
    return this.querySelector<T>(selector)
  }

  /**
   * 选择 shadow root 下的元素
   */
  querySelectorShadow<T extends Element>(selector: string) {
    return this.shadowRoot?.querySelector?.<T>(selector) ?? null
  }

  /**
   * 选择 shadow root 下的元素
   */
  querySelectorAllHost<T extends Element>(selector: string) {
    return this.querySelectorAll<T>(selector)
  }

  /**
   * 选择宿主元素下的元素
   */
  querySelectorAllShadow<T extends Element>(selector: string) {
    return this.shadowRoot?.querySelectorAll?.<T>(selector) ?? null
  }

  static get observedAttributes(): readonly string[] | string[] {
    return []
  }
}
