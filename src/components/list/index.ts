import { BlocksVList, VirtualItem, VListEventMap } from '../vlist/index.js'
import { dispatchEvent } from '../../common/event.js'
import { parseHighlight } from '../../common/highlight.js'
import { template } from './template.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import {
  ISelected,
  ISelectListEventMap,
  ISelectableListComponent,
} from '../../common/connectSelectable.js'
import { ComponentEventListener } from '../Component.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

interface BlocksListEventMap extends VListEventMap, ISelectListEventMap {}

export interface BlocksList extends BlocksVList, ISelectableListComponent {
  idMethod?: (data: any) => string
  labelMethod?: (data: any) => string

  addEventListener<K extends keyof BlocksListEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksListEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@customElement('bl-list')
export class BlocksList extends BlocksVList {
  #checkedSet: Set<VirtualItem>

  static override get observedAttributes() {
    return super.observedAttributes.concat([
      'border',
      'disabled',
      'disabled-field',
      'id-field',
      'label-field',
      'checkable',
      'multiple',
      'search',
      'stripe',
    ])
  }

  @attr('boolean') accessor disabled!: boolean

  @attr('string') accessor disabledField = 'disabled'

  @attr('string') accessor idField = 'id'

  @attr('string') accessor labelField!: string | null

  @attr('boolean') accessor checkable!: boolean

  @attr('boolean') accessor multiple!: boolean

  @attr('string') accessor search!: string | null

  constructor() {
    super()

    const { comTemplate } = template()
    const shadowRoot = this.shadowRoot!
    shadowRoot.insertBefore(
      comTemplate.content.cloneNode(true),
      this._ref.$viewport as any
    )

    this.#checkedSet = new Set()

    this._ref.$list.onclick = e => {
      if (this.disabled) return

      let $item = e.target as HTMLElement
      if ($item === this._ref.$list) return
      while ($item !== this._ref.$list) {
        if ($item.classList.contains('item')) {
          break
        }
        $item = $item.parentElement!
      }
      if ($item.hasAttribute('disabled')) return

      dispatchEvent(this, 'click-item', {
        detail: {
          id: $item.dataset.id,
          data: this.getVirtualItemByKey($item.dataset.id!)?.data,
        },
      })

      if (this.checkable) {
        this._selectItem($item)
      }
    }

    const isDisabledItem = ($item: Element): boolean => {
      return this.disabled || $item.hasAttribute('disabled')
    }
    captureEventWhenEnable(this, 'keydown', e => {
      const $focus = this._ref.$list.querySelector<HTMLElement>(':focus')

      if (e.key === 'ArrowDown') {
        if (!$focus) return
        e.preventDefault()
        let $next = $focus.nextElementSibling
        while ($next && isDisabledItem($next)) {
          $next = $next.nextElementSibling
        }
        if ($next) {
          ;($next as HTMLElement).focus()
        } else {
          const scrollableBottom = this._ref.$viewport.getScrollableBottom()
          const scrollDelta = Math.min(
            this.viewportHeight / 2,
            scrollableBottom
          )
          // 滚动，触发渲染下方内容
          this._ref.$viewport.viewportScrollTop += scrollDelta
        }
      } else if (e.key === 'ArrowUp') {
        if (!$focus) return
        e.preventDefault()
        let $prev = $focus.previousElementSibling
        while ($prev && isDisabledItem($prev)) {
          $prev = $prev.previousElementSibling
        }
        if ($prev) {
          ;($prev as HTMLElement).focus()
        } else {
          const scrollableTop = this._ref.$viewport.getScrollableTop()
          const scrollDelta = Math.min(this.viewportHeight / 2, scrollableTop)
          // 滚动，触发渲染上方内容
          this._ref.$viewport.viewportScrollTop -= scrollDelta
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!$focus) return
        // 避免空格导致翻页
        e.preventDefault()
        // 模拟触发点击，执行点击的事件处理器
        $focus.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          })
        )
      }
    })
  }

  get checkedData() {
    return [...(this.#checkedSet ?? [])].map((vitem: VirtualItem) => vitem.data)
  }

  set checkedData(data) {
    this.#checkedSet = new Set(
      data
        .map(data => this.virtualDataMap[this.keyMethod(data)])
        .filter(vitem => !!vitem)
    )
    this.render()
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checkedData.map(data => ({
          label: this.internalLabelMethod(data),
          value: this.keyMethod(data),
        })),
      },
    })
  }

  get checked() {
    return this.checkedData.map(this.keyMethod.bind(this))
  }

  set checked(ids: string[]) {
    const vitems = ids
      .map(id => this.getVirtualItemByKey(id))
      .filter(vitem => !!vitem)
    this.#checkedSet = new Set(vitems)
    this.render()
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checkedData.map(data => ({
          label: this.internalLabelMethod(data),
          value: this.keyMethod(data),
        })),
      },
    })
  }

  select(data: ISelected) {
    const vitem = this.virtualDataMap[data.value]
    if (!vitem) return
    if (this.#checkedSet.has(vitem)) return
    if (this.multiple) {
      this.#checkedSet.add(vitem)
    } else {
      this.#checkedSet = new Set([vitem])
    }
    this.render()
    dispatchEvent(this, 'select-list:select', { detail: { value: data } })
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checkedData.map(data => ({
          label: this.internalLabelMethod(data),
          value: this.keyMethod(data),
        })),
      },
    })
  }

  // 实现 ISelectableListComponent 的方法
  deselect(data: ISelected) {
    const vitem = this.virtualDataMap[data.value]
    if (!vitem) return
    if (!this.#checkedSet.has(vitem)) return
    this.#checkedSet.delete(vitem)
    this.render()
    dispatchEvent(this, 'select-list:deselect', { detail: { value: data } })
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checkedData.map(data => ({
          label: this.internalLabelMethod(data),
          value: this.keyMethod(data),
        })),
      },
    })
  }

  // 实现 ISelectableListComponent 的方法
  searchSelectable(searchString: string) {
    this.search = searchString
  }

  // 实现 ISelectableListComponent 的方法
  clearSelected() {
    if (this.checkedData.length) {
      this.checkedData = []
    }
  }

  _selectItem($item: HTMLElement) {
    const vitem = this.virtualDataMap[$item.dataset.virtualKey!]
    const label = this.internalLabelMethod(vitem.data)
    const value = this.keyMethod(vitem.data)
    if (this.multiple) {
      if (this.#checkedSet.has(vitem)) {
        this.deselect({ value, label })
      } else {
        this.select({ value, label })
      }
    } else {
      this.select({ value, label })
    }
  }

  _renderDisabled() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.setAttribute('aria-disabled', 'false')
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    switch (attrName) {
      case 'disabled': {
        this._renderDisabled()
        break
      }
      case 'disabled-field': {
        this.render()
        break
      }
      case 'search': {
        this.generateViewData()
        break
      }
      // 从多选改成单选，保留最后一个选择的值
      case 'multiple': {
        if (this.checkable && !this.multiple && this.#checkedSet!.size) {
          this.#checkedSet = new Set([
            [...this.#checkedSet!][this.#checkedSet!.size - 1],
          ])
        }
        break
      }
      case 'id-field': {
        if (this.idField) {
          this.keyMethod = (data: any) => {
            return data[this.idField]
          }
        }
        break
      }
      default: {
        if (BlocksList.observedAttributes.includes(attrName)) {
          this.render()
        }
      }
    }
  }

  // 从数据中提取 label 的方法
  internalLabelMethod(data: any) {
    if (typeof this.labelMethod === 'function')
      return this.labelMethod(data) ?? ''
    if (typeof this.labelField === 'string') return data[this.labelField] ?? ''
    return data.label ?? ''
  }

  // 从数据中提取唯一 key 的方法
  override keyMethod(data: any): string {
    if (this.idMethod) {
      return this.idMethod(data)
    }
    return data[this.idField]
  }

  override async filterMethod(data: any) {
    if (!this.search) return data
    const len = data.length
    const results: any[] = []
    // 第二遍，提取数据，并移除标识
    return new Promise(resolve => {
      setTimeout(() => {
        for (let i = 0; i < len; i += 1) {
          const vItem = data[i]
          if (this.internalLabelMethod(vItem.data).includes(this.search)) {
            results.push(vItem)
          }
        }
        resolve(results)
      })
    })
  }

  parseHighlight(label: string, highlightText: string) {
    return parseHighlight(label, highlightText)
  }

  _renderItemDisabled($item: HTMLElement, vitem: any) {
    const isDisabled =
      (this.disabled || vitem.data[this.disabledField]) ?? false
    if (isDisabled) {
      $item.removeAttribute('tabindex')
      $item.setAttribute('disabled', '')
    } else {
      $item.setAttribute('tabindex', '-1')
      $item.removeAttribute('disabled')
    }
    if (this.#checkedSet!.has(vitem)) {
      $item.classList.add('checked')
    } else {
      $item.classList.remove('checked')
    }
  }
  override itemRender($item: HTMLElement, vitem: any) {
    $item.classList.add('item')
    $item.innerHTML = `<div class="prefix"></div><div class="label"></div><div class="suffix"></div>`

    const label = this.internalLabelMethod(vitem.data) ?? ''
    if (this.search && this.search.length) {
      $item.children[1].innerHTML = this.parseHighlight(label, this.search)
        .map(textSlice => {
          return `<span class="${textSlice.highlight ? 'highlight' : ''}">${
            textSlice.text
          }</span>`
        })
        .join('')
    } else {
      $item.children[1].innerHTML = label
    }

    this._renderItemDisabled($item, vitem)
  }
}
