import type { Component } from '../component/Component'
export interface InitOptions<T> {
  component: T
  predicate: (this: T) => boolean
  target: (this: T) => ArrayLike<Element>
  postUpdate?: (this: T) => void
}

export class SetupDisabled<T extends Component = Component> {
  static setup<T extends Component = Component>(options: InitOptions<T>) {
    return new SetupDisabled(options).setup()
  }

  #setup = false
  #component: T
  #predicate: (this: T) => boolean
  #target: InitOptions<T>['target']
  #postUpdate?: (this: T) => void

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    this.#predicate = options.predicate
    this.#postUpdate = options.postUpdate
    this.#target = options.target
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

  setup() {
    if (this.#setup) return this
    this.#setup = true
    const update = () => this.update()
    this.#component.onRender(update)
    this.#component.onConnected(update)
    this.#component.onAttributeChangedDep('disabled', update)

    // 组件 disabled 时候，静态 getter disableEventTypes 中指定的事件不允许派发
    const types: string[] = (this.#component.constructor as any).disableEventTypes
    if (types?.length) {
      // 组件构造过程，立即注册事件（并且注册在捕获阶段），
      // 以确保最早被执行，从而有机会阻止用户注册的同类事件
      // 并且不能在 disconnect 的时候解绑（随着组件销毁自动回收即可）
      const handler = (e: Event) => {
        if (this.#predicate.call(this.#component)) {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
      }
      for (let i = 0; i < types.length; ++i) {
        this.#component.addEventListener(types[i], handler, true)
      }
    }
    return this
  }

  update() {
    const $target = this.#target.call(this.#component)
    if (!$target.length) return
    const disabled = this.#predicate.call(this.#component)

    for (let i = 0; i < $target.length; ++i) {
      const $el = $target[i]
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
