import type { Component } from '../component/Component'
export interface InitOptions<T> {
  component: T
  predicate: (this: T) => boolean
  target: (this: T) => Element
  className?: string
  postUpdate?: (this: T) => void
  init?: (this: T) => void
}

export class SetupEmpty<T extends Component = Component> {
  static setup<T extends Component = Component>(options: InitOptions<T>) {
    return new SetupEmpty(options).setup()
  }

  #setup = false
  #component: T
  #predicate: (this: T) => boolean
  #target: (this: T) => Element
  #className: string
  #postUpdate?: (this: T) => void
  #init?: (this: T) => void

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    this.#predicate = options.predicate
    this.#target = options.target
    this.#postUpdate = options.postUpdate
    this.#init = options.init
    this.#className = options.className ?? 'empty'
  }

  withTarget(target: InitOptions<T>['target']) {
    this.#target = target
    return this
  }

  withPredicate(isEmpty: InitOptions<T>['predicate']) {
    this.#predicate = isEmpty
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
    if (this.#init) this.#init.call(this.#component)
    return this
  }

  update() {
    const $target = this.#target.call(this.#component)
    const isEmpty = this.#predicate.call(this.#component)
    $target.classList.toggle(this.#className, isEmpty)
    if (this.#postUpdate) {
      this.#postUpdate.call(this.#component)
    }
    return this
  }
}
