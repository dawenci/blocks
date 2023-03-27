import type { Component } from '../component/Component'

export type TabIndex = number | `${number}` | null

export interface InitOptions<T> {
  component: T
  target: (this: T) => ArrayLike<Node>
  tabIndex?: TabIndex
  disabledPredicate?: (this: T) => boolean
  postUpdate?: (this: T) => void
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
export class SetupTabIndex<T extends Component = Component> {
  static setup<T extends Component = Component>(options: InitOptions<T>) {
    return new SetupTabIndex(options).setup()
  }

  #setup = false
  #component: T
  #disabledPredicate: InitOptions<T>['disabledPredicate']
  #postUpdate: InitOptions<T>['postUpdate']
  #target: InitOptions<T>['target']

  #internalTabIndex: TabIndex = null
  get tabIndex() {
    return this.#internalTabIndex
  }
  set tabIndex(value: TabIndex) {
    if (this.#internalTabIndex === value) return
    this.#internalTabIndex = value
    this.update()
  }

  constructor(options: InitOptions<T>) {
    this.#component = options.component
    if (options.tabIndex != null) this.#internalTabIndex = options.tabIndex
    this.#postUpdate = options.postUpdate
    this.#target = options.target
    this.#disabledPredicate = options.disabledPredicate
  }

  withTabIndex(tabIndex: TabIndex) {
    this.tabIndex = tabIndex
    return this
  }

  withDisabledPredicate(getDisabled: InitOptions<T>['disabledPredicate']) {
    this.#disabledPredicate = getDisabled
    return this
  }

  withPostUpdate(postUpdate: InitOptions<T>['postUpdate']) {
    this.#postUpdate = postUpdate
    return this
  }

  withTarget(target: InitOptions<T>['target']) {
    this.#target = target
    return this
  }

  update() {
    const value =
      (this.#disabledPredicate && this.#disabledPredicate.call(this.#component)) || this.tabIndex == null
        ? null
        : this.tabIndex
    const $elements = this.#target.call(this.#component)
    for (let i = 0; i < $elements.length; ++i) {
      const $el = $elements[i] as Element
      if (!$el) continue
      if (value === null) {
        $el.removeAttribute('tabindex')
      } else {
        $el.setAttribute('tabindex', String(value))
      }
      if (this.#postUpdate) {
        this.#postUpdate.call(this.#component)
      }
    }
  }

  setup() {
    if (this.#setup) return this
    this.#setup = true

    const update = () => {
      this.update()
    }
    this.#component.onRender(update)
    this.#component.onConnected(update)
    this.#component.onAttributeChangedDep('disabled', update)
    this.#component.onAttributeChangedDep('tabindex', (_, __, val) => {
      this.tabIndex = val as TabIndex
      update()
    })
    return this
  }
}
