import type { ISelected, ISelectResultComponent, ISelectResultEventMap } from '../../common/connectSelectable.js'
import '../tag/index.js'
import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import {
  contentTemplate,
  moreTemplate,
  placeholderTemplate,
  searchTemplate,
  tagTemplate,
  valueTextTemplate,
} from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { BlTag } from '../tag/index.js'
import { BlClearableControlBox, BlClearableControlBoxEventMap } from '../base-clearable-control-box/index.js'
import { BlComponentEventListener } from '../component/Component.js'

interface BlSelectResultEventMap extends BlClearableControlBoxEventMap, ISelectResultEventMap {
  search: CustomEvent<{ value: string }>
}

export interface BlSelectResult extends BlClearableControlBox, ISelectResultComponent {
  addEventListener<K extends keyof BlSelectResultEventMap>(
    type: K,
    listener: BlComponentEventListener<BlSelectResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlSelectResultEventMap>(
    type: K,
    listener: BlComponentEventListener<BlSelectResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-select-result',
  styles: [style],
})
export class BlSelectResult extends BlClearableControlBox implements ISelectResultComponent {
  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('boolean') accessor multiple!: boolean

  @attr('boolean') accessor searchable!: boolean

  @attr('int') accessor maxTagCount = Infinity

  @attr('string') accessor placeholder!: string | null

  @shadowRef('[part="content"]') accessor $content!: HTMLElement
  @shadowRef('[part="search"]', false) accessor $search!: HTMLInputElement | null
  @shadowRef('[part="value-text"]', false) accessor $valueText!: HTMLElement | null
  @shadowRef('[part="placeholder"]', false) accessor $placeholder!: HTMLElement | null

  constructor() {
    super()

    this.appendContent(contentTemplate())

    this.#setupTabindex()
    this.#setupMultiple()
    this.#setupEmptyClass()
    this.#setupPlaceholder()
    this.#setupData()
    this.#setupSize()
    this.#setupSearch()
    this.#setupDeselect()
    this.#setupClear()

    this.hook.onConnected(this.render)
  }

  // 记录 multiple 模式下，tag 对应的 value
  #tagSelectedMap = new WeakMap<BlTag, ISelected>()

  #data: ISelected[] = []
  get data() {
    return this.#data
  }

  set data(selected: ISelected[]) {
    this.#data = selected
    this._reanderData()
    this._emptyFeature.update()
  }

  get dataCount() {
    return this.data.length
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

  get label(): string {
    return this.data[0]?.label ?? ''
  }
  get labels(): string[] {
    return this.data.map(item => item.label)
  }

  get value(): any | null {
    return this.data[0]?.value ?? null
  }
  get values(): any[] {
    return this.data.map(item => item.value)
  }

  // ISelectResultComponent 接口实现
  acceptSelected(selected: ISelected[]) {
    if (this.multiple) {
      this.data = selected.slice()
    } else {
      this.data = selected.slice(0, 1)
    }
    dispatchEvent(this, 'select-result:after-accept-selected')
  }

  #setupTabindex() {
    this._tabIndexFeature
      .withTabIndex(0)
      // 有搜索时，焦点设置在搜索框，否则设置在 $layout
      .withTarget(() => (this.searchable ? [this.$search!] : [this.$layout]))
      .withPostUpdate(() => {
        if (this.searchable) {
          this.$layout.removeAttribute('tabindex')
        } else {
          if (this.$search) {
            this.$search.removeAttribute('tabindex')
          }
        }
      })
    this.hook.onAttributeChangedDep('searchable', () => {
      this._tabIndexFeature.update()
    })
  }

  #setupEmptyClass() {
    this._emptyFeature.withPredicate(() => !this.dataCount)
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

  #setupMultiple() {
    const render = () => {
      this.$layout.classList.toggle('single', !this.multiple)
      this.$layout.classList.toggle('multiple', this.multiple)
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('multiple', render)
  }

  #setupPlaceholder() {
    const render = () => {
      if (this.placeholder) {
        if (!this.$placeholder) {
          const $placeholder = placeholderTemplate()
          mountAfter($placeholder, this.$content)
        }
        this.$placeholder!.textContent = this.placeholder
        this.$placeholder!.style.left = this.$content.offsetLeft + 'px'
      } else {
        if (this.$placeholder) {
          unmount(this.$placeholder)
        }
      }
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDeps(['placeholder', 'prefix-icon', 'loading'], render)
  }

  #setupClear() {
    // SelectResultEventMap 接口实现
    const notifyClear = () => {
      if (this.disabled) return
      dispatchEvent(this, 'select-result:clear')
    }

    // 点击清空按钮，发出清空事件，方便候选列表清理
    this.hook.onConnected(() => {
      this.addEventListener('click-clear', notifyClear)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click-clear', notifyClear)
    })
  }

  #setupDeselect() {
    // SelectResultEventMap 接口实现
    const notifyDeselect = <T extends ISelected>(selected: T) => {
      if (this.disabled) return
      dispatchEvent(this, 'select-result:deselect', { detail: { value: selected } })
    }
    // 点击 tag 上的 close 按钮，发出取消选择事件，方便候选列表取消选中状态
    const onDeselect = (e: Event) => {
      const $tag = e.target as BlTag
      notifyDeselect(this.#tagSelectedMap.get($tag)!)
    }
    this.hook.onConnected(() => {
      this.$layout.addEventListener('close', onDeselect)
    })
    this.hook.onDisconnected(() => {
      this.$layout.removeEventListener('close', onDeselect)
    })
  }

  #setupSearch() {
    this.hook.onRender(this._renderSearchable)
    this.hook.onAttributeChangedDep('searchable', this._renderSearchable)
    this.addEventListener('select-result:search', e => {
      this.$layout.classList.toggle('searching', !!e.detail.searchString.length)
    })
    // 输入内容，发出搜索事件，方便候选列表过滤
    this.$layout.oninput = e => {
      const searchString = (e.target as any).value
      this.#notifySearch(searchString)
    }
  }
  _renderSearchable() {
    if (this.searchable) {
      if (!this.$search) {
        const $search = searchTemplate()
        prepend($search, this.$content)
        this._tabIndexFeature.update()
      }
    } else {
      if (this.$search) {
        unmount(this.$search)
      }
    }
  }

  clearSearch() {
    if (this.$search) {
      this.$search.value = ''
      this.#notifySearch('')
    }
  }

  // SelectResultEventMap 接口实现
  #notifySearch(searchString: string) {
    if (this.disabled) return
    dispatchEvent(this, 'select-result:search', { detail: { searchString } })
  }

  #setupData() {
    this.hook.onRender(this._reanderData)
    this.hook.onAttributeChangedDep('max-tag-count', this._reanderData)
  }

  _reanderData() {
    this.$layout.classList.toggle('has-result', !!this.dataCount)

    // 准备 DOM
    if (!this.multiple) {
      if (!this.$valueText) {
        const $valueText = valueTextTemplate()
        append($valueText, this.$content)
      } else {
        this.$valueText.textContent = ''
      }
      // 清空 tag
      this.$content.querySelectorAll('bl-tag').forEach(unmount)
    } else if (this.$valueText) {
      unmount(this.$valueText)
    }

    // 单个结果模式
    if (!this.multiple) {
      const value = this.data[0]
      this.$valueText!.textContent = value ? this.formatter(value) : ''
      return
    }

    // 多个结果模式
    const values = this.data
    const tagCount = Math.min(values.length, this.maxTagCount)
    const hiddenCount = values.length - tagCount
    // 准备 tag dom
    const $tags = this.$content.getElementsByTagName('bl-tag')
    while ($tags.length > tagCount) {
      unmount($tags[$tags.length - 1])
    }
    while ($tags.length < tagCount) {
      const $tag = tagTemplate()
      append($tag, this.$content)
    }
    // 更新 tag 内容
    for (let i = 0; i < tagCount; i += 1) {
      const item = values[i]
      const $tag = $tags[i]
      const label = this.formatter(item)
      $tag.size = this.size
      $tag.textContent = label
      this.#tagSelectedMap.set($tag, item)
      $tag.closeable = this.clearable
    }
    // 对于 max-tag-count 限制了数量的，后面展示数字
    let $more = this.$content.querySelector<HTMLElement>('.more')
    if (hiddenCount > 0) {
      if (!$more) {
        $more = moreTemplate()
        $more.innerText = `+${hiddenCount}`
        if (this.$search) {
          mountBefore($more, this.$search)
        } else {
          append($more, this.$content)
        }
      } else {
        $more.innerText = `+${hiddenCount}`
      }
    } else {
      if ($more) {
        unmount($more)
      }
    }
  }

  #setupSize() {
    this.hook.onAttributeChangedDep('size', this.render)
  }
}
