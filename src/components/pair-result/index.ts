import type {
  ISelected,
  ISelectPair,
  IPairSelectResultComponent,
  IPairSelectResultEventMap,
} from '../../common/connectSelectable.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { template } from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { BlClearableControlBox, BlClearableControlBoxEventMap } from '../base-clearable-control-box/index.js'
import { BlComponentEventListener } from '../component/Component.js'

export interface BlPairResultEventMap extends BlClearableControlBoxEventMap, IPairSelectResultEventMap {
  active: CustomEvent<{ value: 'first' | 'second' | null }>
  'change-first': CustomEvent<{ value: ISelected | null }>
  'change-second': CustomEvent<{ value: ISelected | null }>
  change: CustomEvent<{ value: [ISelected | null, ISelected | null] }>
  search: CustomEvent<{ value: string }>
}

export interface BlPairResult extends BlClearableControlBox, IPairSelectResultComponent {
  addEventListener<K extends keyof BlPairResultEventMap>(
    type: K,
    listener: BlComponentEventListener<BlPairResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlPairResultEventMap>(
    type: K,
    listener: BlComponentEventListener<BlPairResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO: size
@defineClass({
  customElement: 'bl-pair-result',
  styles: [style],
})
export class BlPairResult extends BlClearableControlBox implements IPairSelectResultComponent {
  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('string') accessor placeholderFirst!: string | null
  @attr('string') accessor placeholderSecond!: string | null
  /** 设置一边后，自动激活另一边 */
  @attr('boolean') accessor autoSwitch!: boolean
  /** 两边都有值后，自动关闭弹窗 */
  @attr('boolean') accessor autoCommit!: boolean

  @shadowRef('[part="content"]') accessor $content!: HTMLElement
  @shadowRef('[part="first"]') accessor $first!: HTMLInputElement
  @shadowRef('[part="second"]') accessor $second!: HTMLInputElement
  @shadowRef('[part="separator"]') accessor $separator!: HTMLElement

  constructor() {
    super()

    this.appendContent(template())
    this._disabledFeature.withTarget(() => [this, this.$first, this.$second])
    this._tabIndexFeature.withTabIndex(-1).withTarget(() => [this.$first, this.$second])
    this._emptyFeature.withPredicate(() => !this.firstSelected || !this.secondSelected)
    this.#setupResult()
    this.#setupPlaceholder()
    this.#setupEmptyClass()
    this.#setupClear()
    this.#setupSize()
  }

  #active: 'first' | 'second' | null = null
  get active() {
    return this.#active
  }

  set active(value) {
    if (this.#active === value) return
    this.#active = value
    if (value === 'first') {
      this.$first.classList.toggle('active', true)
      this.$second.classList.toggle('active', false)
      dispatchEvent(this, 'active', { detail: { value: 'first' } })
    } else if (value === 'second') {
      this.$first.classList.toggle('active', false)
      this.$second.classList.toggle('active', true)
      dispatchEvent(this, 'active', { detail: { value: 'second' } })
    } else {
      this.$first.classList.toggle('active', false)
      this.$second.classList.toggle('active', false)
      dispatchEvent(this, 'active', { detail: { value: null } })
    }
  }

  #firstSelected: ISelected | null = null
  get firstSelected() {
    return this.#firstSelected
  }
  set firstSelected(value) {
    this.#firstSelected = value
    this.$first.value = this.firstSelected ? this.formatter(this.firstSelected) : ''

    if (this.firstSelected?.value !== value?.value) {
      dispatchEvent(this, 'change-first', { detail: { value } })
    }
  }

  #secondSelected: ISelected | null = null
  get secondSelected() {
    return this.#secondSelected
  }
  set secondSelected(value) {
    this.#secondSelected = value
    this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : ''

    if (this.secondSelected?.value !== value?.value) {
      dispatchEvent(this, 'change-second', { detail: { value } })
    }
  }

  get activeSelected() {
    switch (this.active) {
      case 'first':
        return this.firstSelected
      case 'second':
        return this.secondSelected
      default:
        return null
    }
  }

  set activeSelected(value) {
    switch (this.active) {
      case 'first': {
        this.firstSelected = value
        break
      }
      case 'second': {
        this.secondSelected = value
        break
      }
    }
  }

  #formatter?: (item: ISelected) => string
  #defaultFormatter: (item: ISelected) => string = (item: ISelected) => item?.label ?? ''
  get formatter() {
    return this.#formatter ?? this.#defaultFormatter
  }

  set formatter(value) {
    if (typeof value === 'function') {
      this.#formatter = value
    }
    this.render()
  }

  get labels(): [string, string] {
    return [this.firstSelected?.label ?? '', this.secondSelected?.label ?? '']
  }

  get values(): [any, any] {
    return [this.firstSelected?.value ?? null, this.secondSelected?.value ?? null]
  }

  #notifyChange() {
    dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } })
    dispatchEvent(this, 'pair-result:after-accept-selected')
  }

  // IPairSelectResultComponent 接口实现
  acceptSelected(selected: ISelectPair) {
    // 两边同时清空
    // 如果启用自动提交，则自动关闭弹窗
    if (!selected[0] && !selected[1]) {
      this.firstSelected = this.secondSelected = null
      if (this.autoCommit) {
        this.active = null
      }
      this.#notifyChange()
    }
    // 两边同时有值
    // 如果启用自动提交，则自动关闭弹窗
    else if (selected[0] && selected[1]) {
      this.firstSelected = selected[0]
      this.secondSelected = selected[1]
      if (this.autoCommit) {
        this.active = null
      }
      this.#notifyChange()
    }
    // 单边赋值
    // 如果启用自动切换，则赋值后自动切换设置另一边
    else {
      if (selected[0]) {
        this.firstSelected = selected[0]
        this.secondSelected = null
        this.#notifyChange()
        if (this.autoSwitch) {
          this.active = 'second'
        }
      } else if (selected[1]) {
        this.secondSelected = selected[1]
        this.firstSelected = null
        this.#notifyChange()
        if (this.autoSwitch) {
          this.active = 'first'
        }
      }
    }
    this._emptyFeature.update()
  }

  #setupResult() {
    const updateDisplay = () => {
      this.$first.value = this.firstSelected ? this.formatter(this.firstSelected) : ''
      this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : ''
    }
    this.hook.onConnected(updateDisplay)

    // 标记该次 focus 是点击了 clear 按钮触发的
    // 点击 clear 无需 active
    let isClickClear = false
    const onClearStart = () => {
      isClickClear = true
    }
    const onFocus = (e: FocusEvent) => {
      const $target = e.target as HTMLInputElement
      if (this.$first.contains($target)) {
        this.active = 'first'
      } else if (this.$second.contains($target)) {
        this.active = 'second'
      }
    }
    const onLayoutFocus = () => {
      if (isClickClear) {
        isClickClear = false
        return
      }
      if (this.active === null) {
        this.active = 'first'
      }
    }
    this.hook.onConnected(() => {
      // 触发顺序：mousedown-clear -> click-clear -> click
      this.addEventListener('mousedown-clear', onClearStart)
      this.addEventListener('click', onLayoutFocus)
      this.$first.onfocus = this.$second.onfocus = onFocus
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('mousedown-clear', onClearStart)
      this.removeEventListener('click', onLayoutFocus)
      this.$first.onfocus = this.$second.onfocus = null
    })
  }

  #setupEmptyClass() {
    const render = () => this._emptyFeature.update()
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onConnected(() => {
      this.addEventListener('select-result:clear', render)
      this.addEventListener('select-result:deselect', render)
      this.addEventListener('select-result:after-accept-selected', render)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('select-result:clear', render)
      this.removeEventListener('select-result:deselect', render)
      this.removeEventListener('select-result:after-accept-selected', render)
    })
  }

  // 处理 placeholder
  #setupPlaceholder() {
    const renderPlaceholder = () => {
      this.$first.setAttribute('placeholder', this.placeholderFirst ?? '')
      this.$second.setAttribute('placeholder', this.placeholderSecond ?? '')
    }
    this.hook.onRender(renderPlaceholder)
    this.hook.onConnected(renderPlaceholder)
    this.hook.onAttributeChangedDeps(['placeholder-first', 'placeholder-second'], renderPlaceholder)
  }

  // SelectResultEventMap 接口实现
  #setupClear() {
    const notifyClear = () => {
      if (this.disabled) return
      dispatchEvent(this, 'pair-result:clear')
    }
    // 点击清空按钮，发出清空事件，方便候选列表清理
    this.hook.onConnected(() => {
      this.addEventListener('click-clear', notifyClear)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click-clear', notifyClear)
    })
  }

  #setupSize() {
    this.hook.onAttributeChangedDep('size', this.render)
  }
}
