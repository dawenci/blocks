import {
  append,
  mountAfter,
  mountBefore,
  prepend,
  unmount,
} from '../common/mount.js'
import { upgradeProperty } from '../common/upgradeProperty.js'
import type { StyleChain } from '../decorators/style.js'

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
  static get observedAttributes(): readonly string[] | string[] {
    return []
  }

  constructor() {
    super()

    const ctor = this.constructor as any

    // 应用 @attachShadow 的结果，
    // 只要 this 对应的 class 自身或者父类上有标记需要 attachShadow（优先从子类读取配置），则执行
    if (ctor._shadowRootInit) {
      this.attachShadow(ctor._shadowRootInit)
    }

    // 应用 @applyStyle 的结果
    // 遍历 class 继承链，从祖先到子孙类的顺序，逐个应用 style
    if (ctor._styleChain && this.shadowRoot) {
      const $lastStyle: HTMLStyleElement =
        (this as any)._$lastStyle ??
        getLastItem(
          this.shadowRoot.children.length
            ? this.shadowRoot.querySelectorAll('style')
            : []
        )
      ;(this as any)._$lastStyle = applyStyleChain(
        this,
        ctor._styleChain,
        this.shadowRoot,
        $lastStyle
      )
    }
  }

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
   * 对指定的 property 执行 upgrade 逻辑
   */
  upgradeProperty(props?: string[]) {
    if (!props) {
      props = ((this.constructor as any).upgradeProperties as string[]) ?? []
    }
    props.forEach(attr => {
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
}

function getLastItem(arrayLike: ArrayLike<any>) {
  return arrayLike[arrayLike.length - 1]
}

function applyStyleChain(
  element: Element,
  chain: StyleChain,
  shadowRoot: ShadowRoot,
  $lastStyle: HTMLStyleElement | null = null
) {
  if (chain.parent) {
    $lastStyle = applyStyleChain(element, chain.parent, shadowRoot, $lastStyle)
  }

  const $style = chain.$style.cloneNode(true) as HTMLStyleElement

  if ($lastStyle) {
    mountAfter($style, $lastStyle)
  } else {
    prepend($style, shadowRoot!)
  }

  return $style
}
