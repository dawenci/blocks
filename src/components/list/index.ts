import type { BlComponentEventListener } from '../component/Component.js'
import type { ISelected, ISelectListEventMap, ISelectableListComponent } from '../../common/connectSelectable.js'
import type { VirtualItem, VListEventMap } from '../vlist/index.js'
import { attr } from '../../decorators/attr/index.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { parseHighlight } from '../../common/highlight.js'
import { style } from './style.js'
import { BlVList } from '../vlist/index.js'
import { SetupDisabled } from '../setup-disabled/index.js'
import { SetupTabIndex } from '../setup-tab-index/index.js'

interface BlListEventMap extends VListEventMap, ISelectListEventMap {}

export interface BlList extends BlVList, ISelectableListComponent {
  idMethod?: (data: any) => string
  labelMethod?: (data: any) => string

  addEventListener<K extends keyof BlListEventMap>(
    type: K,
    listener: BlComponentEventListener<BlListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlListEventMap>(
    type: K,
    listener: BlComponentEventListener<BlListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-list',
  styles: [style],
  attachShadow: {
    mode: 'open',
    delegatesFocus: true,
  },
})
export class BlList extends BlVList implements ISelectableListComponent {
  static override get role() {
    return 'list'
  }

  @attr('boolean', { observed: false }) accessor border!: boolean

  @attr('boolean', { observed: false }) accessor stripe!: boolean

  @attr('boolean') accessor disabled!: boolean

  @attr('string') accessor disabledField = 'disabled'

  @attr('string') accessor idField = 'id'

  @attr('string') accessor labelField!: string | null

  @attr('boolean') accessor checkable!: boolean

  @attr('boolean') accessor multiple!: boolean

  @attr('string') accessor search!: string | null

  #checkedSet: Set<string> = new Set()

  #focusVitem: VirtualItem | null = null

  _disabledFeature = SetupDisabled.setup({
    component: this,
    predicate() {
      return this.disabled
    },
    target() {
      return [this]
    },
  })

  _tabIndexFeature = SetupTabIndex.setup({
    tabIndex: 0,
    component: this,
    disabledPredicate() {
      return this.disabled
    },
    target() {
      return [this.$viewport]
    },
  })

  constructor() {
    super()

    this.#setupEvents()

    this.hook.onConnected(() => {
      this.upgradeProperty(['checkedData', 'checked'])
    })

    this.#setupAria()
  }

  #setupEvents() {
    const onListClick = (e: MouseEvent) => {
      if (this.disabled) return

      let $item = e.target as HTMLElement
      if ($item === this.$list) return
      while ($item !== this.$list) {
        if ($item.classList.contains('item')) {
          break
        }
        $item = $item.parentElement!
      }
      if ($item.hasAttribute('disabled')) return

      this.focusById($item.dataset.virtualKey!)

      dispatchEvent(this, 'click-item', {
        detail: {
          id: $item.dataset.id,
          data: this.getVirtualItemByKey($item.dataset.id!)?.data,
        },
      })

      if (this.checkable) {
        const vitem = this.getVirtualItemByKey($item.dataset.virtualKey!)
        if (!vitem) return
        if (this.multiple && this.#checkedSet.has(vitem.virtualKey)) {
          this.deselectById(vitem.virtualKey)
        } else {
          this.selectById(vitem.virtualKey)
        }
      }
    }
    this.hook.onConnected(() => {
      this.$list.onclick = onListClick
    })
    this.hook.onDisconnected(() => {
      this.$list.onclick = null
    })

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        // if (!$focus) return
        this.focusNext()
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        // if (!$focus) return
        this.focusPrev()
        e.preventDefault()
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!this.checkable || !this.#focusVitem) return
        // 避免空格导致翻页
        e.preventDefault()
        if (this.multiple && this.#checkedSet.has(this.#focusVitem.virtualKey)) {
          this.deselectById(this.#focusVitem.virtualKey)
        } else {
          this.selectById(this.#focusVitem.virtualKey)
        }
      }
    }
    let clearKeydown: () => void
    this.hook.onConnected(() => {
      clearKeydown = captureEventWhenEnable(this, 'keydown', onKeydown)
    })
    this.hook.onDisconnected(() => {
      clearKeydown()
    })

    const clearFocus = () => {
      this.focusById('')
    }
    this.hook.onConnected(() => {
      this.$viewport.addEventListener('blur', clearFocus)
    })
    this.hook.onDisconnected(() => {
      this.$viewport.removeEventListener('blur', clearFocus)
    })
  }

  get checkedData() {
    return [...(this.#checkedSet ?? [])].map(vkey => this.getVirtualItemByKey(vkey).data)
  }

  // 注意：databound 之前设置无效
  set checkedData(data) {
    this.checked = data.map(data => this.keyMethod(data))
  }

  get checked() {
    return this.checkedData.map(this.keyMethod.bind(this))
  }

  // 注意：databound 之前设置无效
  set checked(ids: string[]) {
    const newIds = new Set(ids.filter(id => !!this.getVirtualItemByKey(id)))

    check: if (this.#checkedSet.size === newIds.size) {
      for (const i of newIds.values()) {
        if (!this.#checkedSet.has(i)) break check
      }
      return
    }

    this.#checkedSet = newIds

    this.render()

    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checked.map(value => ({
          value,
          label: this.internalLabelMethod(this.getVirtualItemByKey(value)),
        })),
      },
    })
  }

  focusById(id: string) {
    const old = this.#focusVitem
    this.#focusVitem = this.getVirtualItemByKey(id) ?? null

    if (this.#focusVitem?.virtualKey === old?.virtualKey) return

    // 新结点在视野内，则刷新 DOM
    if (this.#focusVitem) {
      const $item = this.getNodeByVirtualKey(id)
      if ($item) this.itemRender($item, this.#focusVitem)
    }
    // 旧结点在视野内，则刷新 DOM
    if (old) {
      const $item = this.getNodeByVirtualKey(old.virtualKey)
      if ($item) this.itemRender($item, old)
    }
  }

  focusNext() {
    const totalCount = this.virtualViewData.length
    if (!totalCount) return
    let index: number
    const current = this.#focusVitem
    if (current) {
      index = current.virtualViewIndex + 1
      if (index >= totalCount) return
    } else {
      index = 0
    }
    let result: any
    for (; index < totalCount; ++index) {
      const vitem = this.virtualViewData[index]
      if ((vitem.data as any)[this.disabledField]) {
        continue
      }
      result = vitem
      break
    }
    if (result) {
      this.focusById(result.virtualKey)
      // 不在视野中，滚动过去
      if (!this.$list.querySelector<HTMLElement>(`[data-virtual-key="${result.virtualKey}"]`)) {
        this.scrollToKey(result.virtualKey, 0)
      }
    }
  }

  focusPrev() {
    const totalCount = this.virtualViewData.length
    if (!totalCount) return
    let index: number
    const current = this.#focusVitem
    if (current) {
      index = current.virtualViewIndex - 1
      if (index < 0) return
    } else {
      index = this.virtualViewData.length - 1
    }
    let result: any
    for (; index >= 0; --index) {
      const vitem = this.virtualViewData[index]
      if ((vitem.data as any)[this.disabledField]) {
        continue
      }
      result = vitem
      break
    }
    if (result) {
      this.focusById(result.virtualKey)
      // 不在视野中，滚动过去
      if (!this.$list.querySelector<HTMLElement>(`[data-virtual-key="${result.virtualKey}"]`)) {
        this.backScrollToKey(result.virtualKey, 0)
      }
    }
  }

  select(data: ISelected) {
    const vitem = this.getVirtualItemByKey(data.value)
    if (!vitem) return
    const vkey = vitem.virtualKey
    if (this.#checkedSet.has(vkey)) return
    if (this.multiple) {
      this.#checkedSet.add(vkey)
      // 新增的条目如果在视野内，则重新渲染条目
      const $item = this.getNodeByVirtualKey(vkey)
      if ($item) this.itemRender($item, vitem)
    } else {
      const [old] = [...this.#checkedSet.values()]
      this.#checkedSet = new Set([vkey])
      // 如果相关条目在视野内，则重新渲染条目
      const $new = this.getNodeByVirtualKey(vkey)
      if ($new) this.itemRender($new, vitem)
      const $old = old && this.getNodeByVirtualKey(old)
      if ($old) this.itemRender($old, this.getVirtualItemByKey(old))
    }
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
    const vitem = this.getVirtualItemByKey(data.value)
    if (!vitem) return
    const vkey = vitem.virtualKey
    if (!this.#checkedSet.has(vkey)) return
    this.#checkedSet.delete(vkey)
    dispatchEvent(this, 'select-list:deselect', { detail: { value: data } })
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: this.checkedData.map(data => ({
          label: this.internalLabelMethod(data),
          value: this.keyMethod(data),
        })),
      },
    })
    // 取消选择的条目在视野内，则重新渲染该条目
    const $item = this.getNodeByVirtualKey(vkey)
    if ($item) {
      this.itemRender($item, vitem)
    }
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
    dispatchEvent(this, 'select-list:after-clear')
  }

  selectById(id: string) {
    const vitem = this.getVirtualItemByKey(id)
    if (!vitem) return
    const label = this.internalLabelMethod(vitem.data)
    const value = this.keyMethod(vitem.data)
    this.select({ value, label })
  }

  deselectById(id: string) {
    const vitem = this.getVirtualItemByKey(id)
    if (!vitem) return
    const label = this.internalLabelMethod(vitem.data)
    const value = this.keyMethod(vitem.data)
    this.deselect({ value, label })
  }

  _renderDisabled() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.setAttribute('aria-disabled', 'false')
    }
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
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
        this.generateViewData({
          complete: () => {
            /*noop*/
          },
        })
        break
      }
      // 从多选改成单选，保留最后一个选择的值
      case 'multiple': {
        if (this.checkable && !this.multiple && this.#checkedSet!.size) {
          this.#checkedSet = new Set([[...this.#checkedSet!][this.#checkedSet!.size - 1]])
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
        if (BlList.observedAttributes.includes(attrName)) {
          this.render()
        }
      }
    }
  }

  // 从数据中提取 label 的方法
  internalLabelMethod(data: any) {
    if (typeof this.labelMethod === 'function') return this.labelMethod(data) ?? ''
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

  override filterMethod(data: any, callback: (data: any) => any) {
    if (!this.search) return callback(data)
    const len = data.length
    const results: any[] = []
    // 第二遍，提取数据，并移除标识
    setTimeout(() => {
      for (let i = 0; i < len; i += 1) {
        const vItem = data[i]
        if (this.internalLabelMethod(vItem.data).includes(this.search)) {
          results.push(vItem)
        }
      }
      callback(results)
    })
  }

  parseHighlight(label: string, highlightText: string) {
    return parseHighlight(label, highlightText)
  }

  _renderItemFocus($item: HTMLElement, vitem: any) {
    $item.classList.toggle('focus', !!this.#focusVitem && this.#focusVitem.virtualKey === vitem.virtualKey)
  }
  _renderItemChecked($item: HTMLElement, vitem: any) {
    if (this.#checkedSet.has(vitem.virtualKey)) {
      $item.classList.add('checked')
    } else {
      $item.classList.remove('checked')
    }
  }
  _renderItemDisabled($item: HTMLElement, vitem: any) {
    const isDisabled = (this.disabled || vitem.data[this.disabledField]) ?? false
    if (isDisabled) {
      $item.setAttribute('disabled', '')
    } else {
      $item.removeAttribute('disabled')
    }
  }
  override itemRender($item: HTMLElement, vitem: any) {
    if (!$item.classList.contains('item')) {
      $item.classList.add('item')
      if (this.children.length) {
        const $fragment = document.createDocumentFragment()
        Array.prototype.forEach.call(this.children, $child => {
          $fragment.appendChild($child.cloneNode(true))
        })
        $item.appendChild($fragment)
      } else {
        $item.innerHTML = `<div class="prefix"></div>
<div class="label"></div>
<div class="suffix"></div>`
      }
    }

    const $label = $item.querySelector('.label')
    if (!$label) return
    const label = this.internalLabelMethod(vitem.data) ?? ''
    if (this.search && this.search.length) {
      $label.innerHTML = this.parseHighlight(label, this.search)
        .map(textSlice => {
          return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`
        })
        .join('')
    } else {
      $label.innerHTML = label
    }

    this._renderItemDisabled($item, vitem)
    this._renderItemChecked($item, vitem)
    this._renderItemFocus($item, vitem)
  }

  #setupAria() {
    const update = () => {
      if (!this.checkable) {
        this.removeAttribute('aria-multiselectable')
      } else {
        this.setAttribute('aria-multiselectable', this.multiple ? 'true' : 'false')
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['checkable', 'multiple'], update)
  }
}
