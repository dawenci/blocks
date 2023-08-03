import type { BlComponent } from '../component/Component.js'
import { append, prepend, unmount } from '../../common/mount.js'

export interface InitOptions<T> {
  component: T
  predicate: (this: T) => boolean
  container: (this: T) => Element
  loop?: boolean
  init?: (this: T) => void
}

// 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
export class SetupFocusCapture<T extends BlComponent = BlComponent> {
  static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>) {
    return new SetupFocusCapture(options).setup()
  }

  #setup = false
  #component: T
  #predicate: (this: T) => boolean
  #container: InitOptions<T>['container']
  #firstFocusable: HTMLButtonElement | null = null
  #lastFocusable: HTMLButtonElement | null = null
  #lastFocus: HTMLElement | null = null
  #loop = false
  #init?: (this: T) => void

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    this.#container = options.container
    this.#predicate = options.predicate
    this.#init = options.init
    if (options.loop) this.#loop = true
  }

  get $lastFocus() {
    return this.#lastFocus
  }
  set $lastFocus(value) {
    this.#lastFocus = value
  }

  get $firstFocusable() {
    return this.#firstFocusable
  }

  get $lastFocusable() {
    return this.#lastFocusable
  }

  withContainer(container: InitOptions<T>['container']) {
    this.#container = container
    return this
  }

  withPredicate(getDisabled: InitOptions<T>['predicate']) {
    this.#predicate = getDisabled
    return this
  }

  withLoop(loop: boolean) {
    this.#loop = !!loop
    if (this.#firstFocusable && (this.#firstFocusable.onkeydown || this.#firstFocusable.onfocus)) {
      this.start()
    }
  }

  // 开始强制捕获焦点
  start() {
    const $container = this.#container.call(this.#component)
    if (!this.#firstFocusable) {
      this.#firstFocusable = document.createElement('button')
      this.#firstFocusable.setAttribute('part', 'first-focusable')
    }
    if ($container.firstElementChild !== this.#firstFocusable) prepend(this.#firstFocusable, $container)

    if (!this.#lastFocusable) {
      this.#lastFocusable = document.createElement('button')
      this.#lastFocusable.setAttribute('part', 'last-focusable')
    }
    if ($container.lastElementChild !== this.#lastFocusable) append(this.#lastFocusable, $container)

    if (this.#loop) {
      this.#firstFocusable!.onfocus = this.#lastFocusable!.onfocus = null
      this.#firstFocusable.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && e.shiftKey) {
          this.#lastFocusable?.focus()
        }
      }
      this.#lastFocusable.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          this.#firstFocusable?.focus()
        }
      }
    } else {
      this.#firstFocusable.onkeydown = this.#lastFocusable.onkeydown = null
      this.#firstFocusable!.onfocus = this.#lastFocusable!.onfocus = () => {
        if (this.#lastFocus) {
          this.#lastFocus.focus()
        }
      }
    }
    return this
  }

  // 停止强制捕获焦点
  stop() {
    if (this.#firstFocusable) {
      this.#firstFocusable.onkeydown = this.#firstFocusable.onfocus = null
      unmount(this.#firstFocusable)
    }
    if (this.#lastFocusable) {
      this.#lastFocusable.onkeydown = this.#lastFocusable.onfocus = null
      unmount(this.#lastFocusable)
    }
    return this
  }

  setup() {
    if (this.#setup) return this
    this.#setup = true
    this.#component.addEventListener(
      'blur',
      (e: FocusEvent) => {
        if (!this.#predicate.call(this.#component)) return
        this.#lastFocus = e.target as HTMLElement
      },
      true
    )
    if (this.#init) this.#init.call(this.#component)
    return this
  }
}
