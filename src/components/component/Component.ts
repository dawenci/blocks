import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js'
import { defineClass } from '../../decorators/defineClass.js'
import { uniqId } from '../../common/uniqId.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import * as hook from './hook-internal.js'

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

let cidSeed = uniqId()

@defineClass({
  attachShadow: true,
})
export class Component extends HTMLElement {
  static get observedAttributes(): readonly string[] {
    return []
  }

  constructor() {
    super()
    hook.setCurrentHook(this.#hook)

    const ctor = this.constructor as any

    // 应用 defineClass({ attachShadow }) 的结果，
    // 只要 this 对应的 class 自身或者父类上有标记需要 attachShadow（优先从子类读取配置），则执行
    if (ctor._shadowRootInit) {
      this.attachShadow(ctor._shadowRootInit)
    }

    // 应用 defineClass({ styles }) 的结果
    // 从 class 自身或继承链上的祖先类中，获取最近的样式定义，应用 style
    if (this.shadowRoot && ctor._$componentStyle) {
      this.insertStyle(ctor._$componentStyle as DocumentFragment)
    }

    // mixin 的初始化
    if ((this as any).setupMixin) {
      ;(this as any).setupMixin()
    }
  }

  #cid = ++cidSeed
  get cid() {
    return this.#cid
  }

  #hook = new hook.Hook()
  onConnected(callback: hook.ConnectedCallback) {
    hook.onConnected(this.#hook, callback)
  }
  onDisconnected(callback: hook.DisconnectedCallback) {
    hook.onDisconnected(this.#hook, callback)
  }
  onAdopted(callback: hook.AdoptedCallback) {
    hook.onAdopted(this.#hook, callback)
  }
  onAttributeChanged<StrArr extends readonly string[] = string[]>(callback: hook.AttributeChangedCallback<StrArr>) {
    hook.onAttributeChanged(this.#hook, callback)
  }
  onAttributeChangedDep<Str extends string>(dep: Str, callback: hook.AttributeChangedCallback<[Str]>) {
    hook.onAttributeChangedDep(this.#hook, callback, dep)
  }
  onAttributeChangedDeps<StrArr extends readonly string[] = string[]>(
    deps: StrArr,
    callback: hook.AttributeChangedCallback<StrArr>
  ) {
    hook.onAttributeChangedDeps(this.#hook, callback, deps)
  }
  onRender(callback: hook.RenderCallback) {
    hook.onRender(this.#hook, callback)
  }
  clearHooks() {
    hook.clearHooks(this.#hook)
  }

  /**
   * 附加到 DOM 的时候，自动执行属性 upgrade
   */
  connectedCallback() {
    this.initRole()
    this.upgradeProperty()
    this.#hook.call(this, hook.HookType.Connected)
  }

  /**
   * 从 DOM 中脱离
   */
  disconnectedCallback() {
    this.#hook.call(this, hook.HookType.Disconnected)
  }

  /**
   * 跨文档移动 DOM
   */
  adoptedCallback(): void {
    this.#hook.call(this, hook.HookType.Adopted)
  }

  /**
   * attribute 变化处理
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.#hook.call(this, hook.HookType.AttributeChanged, name, oldValue, newValue)
  }

  /**
   * 渲染逻辑
   */
  render() {
    this.#hook.call(this, hook.HookType.Render)
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

  appendShadowChild(node: Node) {
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(node)
    }
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
   * 插入样式
   */
  insertStyle($style: HTMLStyleElement | DocumentFragment | string) {
    if (this.shadowRoot) {
      // 找到当前组件已经插入的 style，如果存在，则新样式插入到该 style 后面
      const $lastStyle: HTMLStyleElement =
        (this as any)._$lastStyle ??
        getLastItem(this.shadowRoot.children.length ? this.shadowRoot.querySelectorAll('style') : [])
      if (typeof $style === 'string') {
        const textContent = $style
        $style = document.createElement('style')
        $style.textContent = textContent
      }
      const _$last = $style.nodeType === 11 ? $style.children[$style.children.length - 1] : $style
      if ($lastStyle) {
        mountAfter($style.cloneNode(true), $lastStyle)
      } else {
        prepend($style.cloneNode(true), this.shadowRoot)
      }
      // 缓存
      ;(this as any)._$lastStyle = _$last
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
    if (this.shadowRoot) {
      return this.shadowRoot.querySelector<T>(selector)
    }
    return null
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
    if (this.shadowRoot) {
      return Array.from(this.shadowRoot.querySelectorAll<T>(selector))
    }
    return []
  }
}

function getLastItem(arrayLike: ArrayLike<any>) {
  return arrayLike[arrayLike.length - 1]
}
