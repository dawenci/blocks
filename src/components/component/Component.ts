import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { uniqId } from '../../common/uniqId.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { Hook } from '../../common/Hook/index.js'
import { Feature } from '../../common/Feature/Feature.js'

export interface BlComponentEventListenerCallback<E extends Event = Event> {
  (evt: E): void
}

export interface BlComponentEventListenerObject<E extends Event = Event> {
  handleEvent(object: E): void
}

export type BlComponentEventListener<E extends Event = Event> =
  | BlComponentEventListenerCallback<E>
  | BlComponentEventListenerObject<E>

export interface BlComponentEventMap extends HTMLElementEventMap {
  [other: string]: Event
}

export interface BlComponent extends HTMLElement {
  addEventListener<K extends keyof BlComponentEventMap>(
    type: K,
    listener: BlComponentEventListener<BlComponentEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlComponentEventMap>(
    type: K,
    listener: BlComponentEventListener<BlComponentEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

let cidSeed = uniqId()

@defineClass({
  attachShadow: true,
})
export class BlComponent extends HTMLElement {
  static get role() {
    return 'widget'
  }

  static get observedAttributes(): readonly string[] {
    return []
  }

  blSilent = false

  #hook = new Hook()
  get hook() {
    return this.#hook
  }

  constructor() {
    super()

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

  _features: Map<string | symbol, Feature> = new Map()
  addFeature(key: string | symbol, feature: Feature) {
    if (!this._features.has(key)) {
      this._features.set(key, feature)
      this.hook.merge(feature.hook)
    }
  }
  getFeature(key: string | symbol) {
    return this._features.get(key)
  }

  /**
   * 附加到 DOM 的时候，自动执行属性 upgrade
   */
  connectedCallback() {
    this.initRole()
    this.upgradeProperty()
    this.hook.callConnected(this)
  }

  /**
   * 从 DOM 中脱离
   */
  disconnectedCallback() {
    this.hook.callDisconnected(this)
  }

  /**
   * 跨文档移动 DOM
   */
  adoptedCallback(): void {
    this.hook.callAdopted(this)
  }

  /**
   * attribute 变化处理
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.hook.callAttributeChanged(this, name, oldValue, newValue)
  }

  /**
   * 渲染逻辑
   */
  render() {
    this.hook.callRender(this)
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
  insertStyle($style: HTMLStyleElement | DocumentFragment | string): HTMLStyleElement | null {
    if (this.shadowRoot) {
      // 找到当前组件已经插入的 style，如果存在，则新样式插入到该 style 后面
      const $lastStyle: HTMLStyleElement =
        (this as any)._$lastStyle ??
        getLastItem(this.shadowRoot.children.length ? this.shadowRoot.querySelectorAll('style') : [])
      if (typeof $style === 'string') {
        const textContent = $style
        $style = document.createElement('style')
        $style.textContent = textContent
      } else {
        $style = $style.cloneNode(true) as HTMLStyleElement | DocumentFragment
      }
      const _$last =
        $style.nodeType === 11
          ? ($style.children[$style.children.length - 1] as HTMLStyleElement)
          : ($style as HTMLStyleElement)
      if ($lastStyle) {
        mountAfter($style, $lastStyle)
      } else {
        prepend($style, this.shadowRoot)
      }
      // 缓存
      ;(this as any)._$lastStyle = _$last
      return _$last
    }
    return null
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

  proxyEvent<T extends Element>(
    $el: T,
    type: Parameters<T['addEventListener']>[0],
    options?: boolean | AddEventListenerOptions
  ): () => void {
    const handler = (event: any) => {
      if (event.detail != null) {
        dispatchEvent(this, type, { detail: event.detail })
      } else {
        dispatchEvent(this, type)
      }
    }
    $el.addEventListener(type, handler, options)
    return () => {
      $el.removeEventListener(type, handler, options)
    }
  }

  #microtasks = new Map()
  /**
   * 注册一次事件循环只调用一次的函数,连续注册,则以最后一次的函数为准
   */
  registerMicrotask(key: any, callback: () => void) {
    if (!this.#microtasks.has(key)) {
      queueMicrotask(() => {
        this.#microtasks.get(key).call(this)
        this.#microtasks.delete(key)
      })
    }
    this.#microtasks.set(key, callback)
  }

  withBlSilent(fn: () => void) {
    const before = this.blSilent
    this.blSilent = true
    fn()
    this.blSilent = before
  }
  override dispatchEvent(event: Event) {
    if (this.blSilent) {
      return event.cancelable === false || event.defaultPrevented === false
    }
    return super.dispatchEvent(event)
  }
}

function getLastItem(arrayLike: ArrayLike<any>) {
  return arrayLike[arrayLike.length - 1]
}
