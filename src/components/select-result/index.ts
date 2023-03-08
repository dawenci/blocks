import '../tag/index.js'
import { dispatchEvent } from '../../common/event.js'
import {
  contentTemplate,
  moreTemplate,
  placeholderTemplate,
  searchTemplate,
  styleTemplate,
  tagTemplate,
  valueTextTemplate,
} from './template.js'
import { BlocksTag } from '../tag/index.js'
import { ComponentEventListener } from '../Component.js'
import { append, mountAfter, mountBefore, unmount } from '../../common/mount.js'
import {
  ClearableControlBox,
  ClearableControlBoxEventMap,
} from '../base-clearable-control-box/index.js'
import {
  ISelected,
  ISelectResultComponent,
  ISelectResultEventMap,
} from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { EnumAttrs } from '../../decorators/attr.js'

interface BlocksSelectResultEventMap
  extends ClearableControlBoxEventMap,
    ISelectResultEventMap {
  search: CustomEvent<{ value: string }>
}

export interface BlocksSelectResult
  extends ClearableControlBox,
    ISelectResultComponent {
  _ref: ClearableControlBox['_ref'] & {
    $content: HTMLElement
    $search?: HTMLInputElement
    $plainTextValue?: HTMLElement
    $placeholder?: HTMLElement
  }

  addEventListener<K extends keyof BlocksSelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksSelectResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksSelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksSelectResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-select-result',
})
export class BlocksSelectResult extends ClearableControlBox {
  static override get observedAttributes() {
    return super.observedAttributes.concat([
      'clearable',
      'max-tag-count',
      'multiple',
      'placeholder',
      'prefix-icon',
      'searchable',
      'size',
      'suffix-icon',
    ])
  }

  @attrs.size accessor size!: EnumAttrs['size']

  @attr('boolean') accessor multiple!: boolean

  @attr('boolean') accessor searchable!: boolean

  @attr('int') accessor maxTagCount = Infinity

  @attr('string') accessor placeholder!: string | null

  constructor() {
    super()

    this._appendStyle(styleTemplate())
    this._ref.$content = this._appendContent(contentTemplate())

    // 输入内容，发出搜索事件，方便候选列表过滤
    this._ref.$layout.oninput = e => {
      const searchString = (e.target as any).value
      this.#notifySearch(searchString)
    }

    // 点击清空按钮，发出清空事件，方便候选列表清理
    this.addEventListener('click-clear', () => {
      this.#notifyClear()
    })

    // 点击 tag 上的 close 按钮，发出取消选择事件，方便候选列表取消选中状态
    this._ref.$layout.onclose = e => {
      const $tag = e.target as BlocksTag
      const label = $tag.textContent ?? ''
      const value = $tag.dataset.value
      this.deselect({ value, label })
    }
  }

  #formatter?: (item: ISelected) => string
  get formatter() {
    if (this.#formatter) {
      return this.#formatter
    }
    return (item: ISelected) => item?.label ?? ''
  }

  set formatter(value) {
    if (typeof value === 'function') {
      this.#formatter = value
    }
    this.render()
  }

  get label() {
    return this._ref.$content.textContent
  }

  _value?: ISelected | ISelected[] | null = null
  get value() {
    return this._value
  }

  set value(value) {
    this._value = value
    this._renderValue()
  }

  // SelectResultEventMap 接口实现
  #notifySearch(searchString: string) {
    if (this.disabled) return
    dispatchEvent(this, 'select-result:search', { detail: { searchString } })
  }

  // SelectResultEventMap 接口实现
  #notifyClear() {
    if (this.disabled) return
    dispatchEvent(this, 'select-result:clear')
  }

  // SelectResultEventMap 接口实现
  #notifyDeselect<T extends ISelected>(selected: T) {
    if (this.disabled) return
    dispatchEvent(this, 'select-result:deselect', {
      detail: { value: selected },
    })
  }

  // ISelectResultComponent 接口实现
  acceptSelected(value: ISelected[]) {
    if (this.multiple) {
      const currentValues = this.getValues()
      const isSame =
        currentValues.length === value.length &&
        currentValues.every(
          (item, index) =>
            item.value === value[index].value &&
            item.label === value[index].label
        )
      if (isSame) {
        return
      }
      this.value = value.slice()
    } else {
      if (value.length === 0) {
        this.value = null
      } else {
        this.value = value[0]
      }
    }
  }

  // ISelectResultComponent 接口可选实现
  select(selected: ISelected) {
    // 单选模式
    if (!this.multiple) {
      this.acceptSelected([selected])
    }
    // 多选模式
    else {
      const values = this.getValues().filter(
        item => item.value !== selected.value
      )
      values.push(selected)
      this.acceptSelected(values)
    }
  }

  // ISelectResultComponent 接口可选实现
  deselect(selected: ISelected) {
    const values = this.getValues()
    const newValues = values.filter(item => item.value !== selected.value)
    this.acceptSelected(newValues)
    this._renderValue()
    this.#notifyDeselect(selected)
  }

  getValue(): ISelected | null {
    if (this.value == null) {
      return null
    }
    if (Array.isArray(this.value)) {
      return this.value[0] ?? null
    }
    return this.value
  }

  getValues(): ISelected[] {
    if (this.value == null) {
      return []
    }
    if (Array.isArray(this.value)) {
      return this.value
    }
    return [this.value]
  }

  clearValue() {
    this._value = null
    this._renderValue()
  }

  override _isEmpty() {
    return this.multiple
      ? !this._ref.$content.querySelectorAll('bl-tag').length
      : !this._ref.$content.textContent
  }

  clearSearch() {
    if (this._ref.$search) {
      this._ref.$search.value = ''
      this.#notifySearch('')
    }
  }

  _renderClass() {
    this._ref.$layout.classList.toggle('single', !this.multiple)
    this._ref.$layout.classList.toggle('multiple', this.multiple)
  }

  _renderPlaceholder() {
    if (this.placeholder) {
      if (!this._ref.$placeholder) {
        this._ref.$placeholder = placeholderTemplate()
        mountAfter(this._ref.$placeholder, this._ref.$content)
      }
      this._ref.$placeholder.textContent = this.placeholder
      this._ref.$placeholder.style.left = this._ref.$content.offsetLeft + 'px'
    } else {
      if (this._ref.$placeholder) {
        unmount(this._ref.$placeholder)
        this._ref.$placeholder = undefined
      }
    }
  }

  _renderSearchable() {
    // 有搜索时，将 layout 的 tab 焦点功能取消，方便聚焦到搜索框，否则启用 layout 的 tab 聚焦
    this.internalTabIndex = this.searchable ? '-1' : '0'

    if (this.searchable) {
      if (!this._ref.$search) {
        const $search = searchTemplate()
        this._ref.$search = $search
        if (this._ref.$plainTextValue) {
          mountBefore($search, this._ref.$plainTextValue)
        } else {
          append($search, this._ref.$content)
        }
      }
    } else {
      if (this._ref.$search) {
        unmount(this._ref.$search)
      }
    }
  }

  _renderValue() {
    this._ref.$layout.classList.toggle('empty', !this.getValues().length)

    // 准备 DOM
    if (!this.multiple) {
      if (!this._ref.$plainTextValue) {
        this._ref.$plainTextValue = valueTextTemplate()
        append(this._ref.$plainTextValue, this._ref.$content)
      } else {
        this._ref.$plainTextValue.textContent = ''
      }
      // 清空 tag
      this._ref.$content.querySelectorAll('bl-tag').forEach(unmount)
    } else if (this._ref.$plainTextValue) {
      unmount(this._ref.$plainTextValue)
    }

    // 单个结果模式
    if (!this.multiple) {
      const value = this.getValue()
      this._ref.$plainTextValue!.textContent = value
        ? this.formatter(value)
        : ''
      return
    }

    // 多个结果模式
    const values = this.getValues()
    const tagCount = Math.min(values.length, this.maxTagCount)
    const hiddenCount = values.length - tagCount
    // 准备 tag dom
    const $tags = this._ref.$content.getElementsByTagName('bl-tag')
    while ($tags.length > tagCount) {
      unmount($tags[$tags.length - 1])
    }
    while ($tags.length < tagCount) {
      const $tag = tagTemplate()
      if (this._ref.$search) {
        mountBefore($tag, this._ref.$search)
      } else {
        append($tag, this._ref.$content)
      }
    }
    // 更新 tag 内容
    for (let i = 0; i < tagCount; i += 1) {
      const item = values[i]
      const $tag = $tags[i]
      const label = this.formatter(item)
      const value = item.value
      $tag.size = this.size
      $tag.textContent = label
      $tag.dataset.value = value
      $tag.closeable = this.clearable
    }
    // 对于 max-tag-count 限制了数量的，后面展示数字
    let $more = this._ref.$content.querySelector<HTMLElement>('.more')
    if (hiddenCount > 0) {
      if (!$more) {
        $more = moreTemplate()
        $more.innerText = `+${hiddenCount}`
        if (this._ref.$search) {
          mountBefore($more, this._ref.$search)
        } else {
          append($more, this._ref.$content)
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

  override render() {
    super.render()
    this._renderClass()
    this._renderPlaceholder()
    this._renderSearchable()
    this._renderValue()
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    switch (attrName) {
      case 'max-tag-count': {
        this._renderValue()
        break
      }
      case 'multiple': {
        this._renderClass()
        break
      }
      case 'placeholder': {
        this._renderPlaceholder()
        break
      }
      case 'searchable': {
        this._renderSearchable()
        break
      }
      case 'prefix-icon':
      case 'loading': {
        this._renderPlaceholder()
        break
      }
      case 'size': {
        this.render()
        break
      }
    }
  }
}
