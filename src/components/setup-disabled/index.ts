import type { BlComponent } from '../component/Component'
export interface InitOptions<T> {
  component: T
  predicate: (this: T) => boolean
  target: (this: T) => ArrayLike<Element>
  postUpdate?: (this: T) => void
  disableEventTypes?: string[]
}

export class SetupDisabled<T extends BlComponent = BlComponent> {
  static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>) {
    return new SetupDisabled(options).setup()
  }

  #setup = false
  #component: T
  #predicate: (this: T) => boolean
  #target: InitOptions<T>['target']
  #postUpdate?: (this: T) => void
  #disableEventTypes: string[]

  #handler = (e: Event) => {
    if (this.#predicate.call(this.#component)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    this.#predicate = options.predicate
    this.#postUpdate = options.postUpdate
    this.#target = options.target
    this.#disableEventTypes = options.disableEventTypes ?? []
  }

  withTarget(target: InitOptions<T>['target']) {
    this.#target = target
    return this
  }

  withPredicate(getDisabled: InitOptions<T>['predicate']) {
    this.#predicate = getDisabled
    return this
  }

  withPostUpdate(postUpdate: InitOptions<T>['postUpdate']) {
    this.#postUpdate = postUpdate
    return this
  }

  withDisableEventTypes(types: string[]) {
    this.#clearEvents()
    this.#disableEventTypes = types
    this.#bindEvents()
  }

  setup() {
    if (this.#setup) return this
    this.#setup = true
    const update = () => this.update()
    this.#component.hook.onRender(update)
    this.#component.hook.onConnected(update)
    this.#component.hook.onAttributeChangedDep('disabled', update)

    this.#bindEvents()
    return this
  }

  #clearEvents() {
    for (const type of this.#disableEventTypes) {
      this.#component.removeEventListener(type, this.#handler, true)
    }
  }

  #bindEvents() {
    // 组件 disabled 时候，静态 getter disableEventTypes 中指定的事件不允许派发
    const types: string[] = this.#disableEventTypes.length
      ? this.#disableEventTypes
      : (this.#component.constructor as any).disableEventTypes
    if (types?.length) {
      // 组件构造过程，立即注册事件（并且注册在捕获阶段），
      // 以确保最早被执行，从而有机会阻止用户注册的同类事件
      // 并且不能在 disconnect 的时候解绑（随着组件销毁自动回收即可）
      for (let i = 0; i < types.length; ++i) {
        this.#component.addEventListener(types[i], this.#handler, true)
      }
    }
  }

  update() {
    const $target = this.#target.call(this.#component)
    if (!$target.length) return
    const disabled = this.#predicate.call(this.#component)

    for (let i = 0; i < $target.length; ++i) {
      const $el = $target[i]
      if (!$el) continue
      // aria-disabled 只需要设置在组件 host 上
      if ($el === this.#component) {
        if (disabled) {
          $el.setAttribute('aria-disabled', 'true')
        } else {
          $el.setAttribute('aria-disabled', 'false')
        }
      } else {
        if (disabled) {
          $el.setAttribute('disabled', '')
        } else {
          $el.removeAttribute('disabled')
        }
      }
    }

    if (this.#postUpdate) {
      this.#postUpdate.call(this.#component)
    }
  }
}
