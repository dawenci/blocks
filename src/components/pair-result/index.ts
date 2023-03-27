import type { EnumAttrs } from '../../decorators/attr.js'
import type {
  ISelected,
  IPairSelectResultComponent,
  IPairSelectResultEventMap,
} from '../../common/connectSelectable.js'
import { attr, attrs } from '../../decorators/attr.js'
import { template } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js'
import { ComponentEventListener } from '../component/Component.js'

export interface BlocksPairResultEventMap extends ClearableControlBoxEventMap, IPairSelectResultEventMap {
  active: CustomEvent<{ value: 'first' | 'second' | null }>
  'change-first': CustomEvent<{ value: ISelected | null }>
  'change-second': CustomEvent<{ value: ISelected | null }>
  change: CustomEvent<{ value: [ISelected | null, ISelected | null] }>
  search: CustomEvent<{ value: string }>
  'select-result:accept': CustomEvent
}

export interface BlocksPairResult extends ClearableControlBox, IPairSelectResultComponent {
  addEventListener<K extends keyof BlocksPairResultEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksPairResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksPairResultEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksPairResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-pair-result',
  styles: [style],
})
export class BlocksPairResult extends ClearableControlBox implements IPairSelectResultComponent {
  static override get disableEventTypes(): readonly string[] {
    return ['focus', 'click', 'touchstart', 'keydown']
  }

  @attrs.size accessor size!: EnumAttrs['size']

  @attr('string') accessor placeholderFirst!: string | null
  @attr('string') accessor placeholderSecond!: string | null

  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('[part="first"]') accessor $first!: HTMLInputElement
  @shadowRef('[part="second"]') accessor $second!: HTMLInputElement

  constructor() {
    super()

    this.appendContent(template())
    this._disabledFeature.withTarget(() => [this, this.$first, this.$second])
    this._tabIndexFeature.withTabIndex(-1)
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
    dispatchEvent(this, 'change-first', { detail: { value } })
  }

  #secondSelected: ISelected | null = null
  get secondSelected() {
    return this.#secondSelected
  }
  set secondSelected(value) {
    this.#secondSelected = value
    this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : ''
    dispatchEvent(this, 'change-second', { detail: { value } })
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

  // IPairSelectResultComponent 接口实现
  acceptSelected(selected: [ISelected | null, ISelected | null]) {
    // 两边同时清空
    if (!selected[0] && !selected[1]) {
      this.firstSelected = this.secondSelected = null
      this.active = null
      dispatchEvent(this, 'change', { detail: { value: [null, null] } })
    }
    // 两边同事有值，则提交
    else if (selected[0] && selected[1]) {
      this.firstSelected = selected[0]
      this.secondSelected = selected[1]
      this.active = null
      dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } })
    }
    // 单边有值，赋值后，则自动激活另一边
    else {
      if (selected[0]) {
        this.firstSelected = selected[0]
        this.secondSelected = null
        dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } })
        this.active = 'second'
      } else if (selected[1]) {
        this.secondSelected = selected[1]
        this.firstSelected = null
        dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } })
        this.active = 'first'
      }
    }
    this._emptyFeature.update()
    dispatchEvent(this, 'select-result:accept')
  }

  #setupResult() {
    const updateDisplay = () => {
      this.$first.value = this.firstSelected ? this.formatter(this.firstSelected) : ''
      this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : ''
    }
    this.onConnected(updateDisplay)

    const onFocus = (e: FocusEvent) => {
      const $target = e.target as HTMLInputElement
      if (this.$first.contains($target)) {
        this.active = 'first'
      } else if (this.$second.contains($target)) {
        this.active = 'second'
      }
    }
    const onLayoutFocus = () => {
      if (this.active === null) {
        this.active = 'first'
      }
    }
    this.onConnected(() => {
      this.$first.onfocus = this.$second.onfocus = onFocus
      this.addEventListener('click', onLayoutFocus)
    })
    this.onDisconnected(() => {
      this.removeEventListener('click', onLayoutFocus)
      this.$first.onfocus = this.$second.onfocus = null
    })
  }

  #setupEmptyClass() {
    const render = () => this._emptyFeature.update()
    this.onRender(render)
    this.onConnected(render)
    this.onConnected(() => {
      this.addEventListener('select-result:clear', render)
      this.addEventListener('select-result:deselect', render)
      this.addEventListener('select-result:accept', render)
    })
    this.onDisconnected(() => {
      this.removeEventListener('select-result:clear', render)
      this.removeEventListener('select-result:deselect', render)
      this.removeEventListener('select-result:accept', render)
    })
  }

  // 处理 placeholder
  #setupPlaceholder() {
    const renderPlaceholder = () => {
      this.$first.setAttribute('placeholder', this.placeholderFirst ?? '')
      this.$second.setAttribute('placeholder', this.placeholderSecond ?? '')
    }
    this.onRender(renderPlaceholder)
    this.onConnected(renderPlaceholder)
    this.onAttributeChangedDeps(['placeholder-first', 'placeholder-second'], renderPlaceholder)
  }

  // SelectResultEventMap 接口实现
  #setupClear() {
    const notifyClear = () => {
      if (this.disabled) return
      dispatchEvent(this, 'pair-result:clear')
    }
    // 点击清空按钮，发出清空事件，方便候选列表清理
    this.onConnected(() => {
      this.addEventListener('click-clear', notifyClear)
    })
    this.onDisconnected(() => {
      this.removeEventListener('click-clear', notifyClear)
    })
  }

  #setupSize() {
    this.onAttributeChangedDep('size', this.render)
  }
}
