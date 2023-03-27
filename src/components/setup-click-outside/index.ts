import { onClickOutside } from '../../common/onClickOutside.js'
import type { Component } from '../component/Component'

export interface InitOptions<T> {
  component: T
  update: (this: T, e: MouseEvent) => any
  target: (this: T) => Element[]
}

export class SetupClickOutside<T extends Component = Component> {
  static setup<T extends Component = Component>(options: InitOptions<T>) {
    return new SetupClickOutside(options).setup()
  }

  #setup = false
  #component: T
  #update: (this: T, e: MouseEvent) => any
  #target: (this: T) => Element[]

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    this.#update = options.update
    this.#target = options.target
  }

  withTarget(target: InitOptions<T>['target']) {
    this.#target = target
    return this
  }

  withUpdate(update: InitOptions<T>['update']) {
    this.#update = update
    return this
  }

  setup() {
    if (this.#setup) return this
    this.#setup = true
    this.#component.onDisconnected(() => {
      this.unbind()
    })
    return this
  }

  #cleanup?: () => void

  bind() {
    if (!this.#cleanup) {
      const targets = this.#target.call(this.#component)
      this.#cleanup = onClickOutside(targets, (e: MouseEvent) => {
        this.#update.call(this.#component, e)
      })
    }
    return this
  }

  unbind() {
    if (this.#cleanup) {
      this.#cleanup()
      this.#cleanup = undefined
    }
    return this
  }
}
