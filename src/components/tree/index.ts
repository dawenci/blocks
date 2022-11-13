import { BlocksVList, VirtualItem, VListEventMap } from '../vlist/index.js'
import {
  boolGetter,
  boolSetter,
  intGetter,
  intSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { isEmpty, merge, uniqBy, flatten } from '../../common/utils.js'
import { dispatchEvent } from '../../common/event.js'
import { parseHighlight } from '../../common/highlight.js'
import { template } from './template.js'
import { ComponentEventListener } from '../Component.js'
import {
  ISelectableListComponent,
  ISelectListEventMap,
} from '../../common/connectSelectable.js'

type NodeData = {
  [index: number]: any
  [key: string]: any
  children?: NodeData[]
}

export interface TreeEventMap extends VListEventMap, ISelectListEventMap {
  change: CustomEvent
  active: CustomEvent<{ key: string; oldKey: string }>
  inactive: CustomEvent<{ key: string }>
  uncheck: CustomEvent<{ key: string }>
  check: CustomEvent<{ key: string }>
  expand: CustomEvent<{ key: string }>
  fold: CustomEvent<{ key: string }>
}

export interface VirtualNode extends VirtualItem {
  parentKey: string
  expanded: boolean
  checked: boolean
  indeterminate: boolean
  parent?: this | null
  children: this[]
  _retain: boolean
}
export class VirtualNode extends VirtualItem {
  constructor(options: any) {
    super(options)
    // 父结点的 key
    this.parentKey = options.parentKey
    // 是否展开状态中
    this.expanded = !!options.expanded
    // 是否选中状态中
    this.checked = !!options.checked
    // 是否半选中状态
    this.indeterminate = !!options.indeterminate
    // 父结点的引用
    this.parent = null
    // 子结点列表
    this.children = []
    // 过滤时临时使用
    this._retain = false
  }
}

export interface BLocksTree extends BlocksVList, ISelectableListComponent {
  addEventListener<K extends keyof TreeEventMap>(
    type: K,
    listener: ComponentEventListener<TreeEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof TreeEventMap>(
    type: K,
    listener: ComponentEventListener<TreeEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export class BlocksTree extends BlocksVList {
  labelMethod?: (data: any) => string
  uniqCid: string
  _checkedSet: Set<VirtualNode>

  #batchUpdateFold?: boolean
  #lastChecked?: VirtualNode

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))

    this.uniqCid = String(Math.random()).substr(2)
    this._checkedSet = new Set()

    this._ref.$list.onclick = this.#onClick.bind(this)

    const onBound = () => {
      this.removeEventListener('data-bound', onBound)
      if (this.defaultFoldAll) {
        this.foldAll()
      }

      if (this._checkedSet.size) {
        this._checkedSet = new Set()
      }
    }
    this.addEventListener('data-bound', onBound)
  }

  static override get observedAttributes() {
    return super.observedAttributes.concat([
      'activable',
      'active-key',
      'checkable',
      'check-on-click-node',
      'check-strictly',
      'border',
      'default-fold-all',
      'disabled',
      'expand-on-click-node',
      'id-field',
      'indent-unit',
      'label-field',
      'multiple',
      'search',
      'stripe',
      'wrap',
    ])
  }

  get activeKey() {
    return strGetter('active-key')(this)
  }

  set activeKey(value) {
    strSetter('active-key')(this, value)
  }

  get activable() {
    return boolGetter('activable')(this)
  }

  set activable(value) {
    boolSetter('activable')(this, value)
  }

  get checkedData(): NodeData[] {
    const data = [...this._checkedSet].map(vitem => vitem.data)
    return data
  }

  set checkedData(value: NodeData[]) {
    const vitems = value
      .map(data => this.virtualDataMap[this.internalKeyMethod(data)])
      .filter(vitem => !!vitem) as VirtualNode[]
    this._checkedSet = new Set(vitems)
    this.render()
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: vitems.map(vitem => {
          return {
            label: this.internalLabelMethod(vitem.data),
            value: this.internalKeyMethod(vitem.data),
          }
        }),
      },
    })
  }

  get checked(): string[] {
    const list = [...this._checkedSet]
    return list.map(vitem => vitem.virtualKey)
  }

  set checked(ids: string[]) {
    const vitems = ids
      .map(id => this.virtualDataMap[id])
      .filter(vitem => !!vitem) as VirtualNode[]
    this._checkedSet = new Set(vitems)
    this.render()
    dispatchEvent(this, 'select-list:change', {
      detail: {
        value: vitems.map(vitem => {
          return {
            label: this.internalLabelMethod(vitem.data),
            value: this.internalKeyMethod(vitem.data),
          }
        }),
      },
    })
  }

  get checkable() {
    return boolGetter('checkable')(this)
  }

  set checkable(value) {
    boolSetter('checkable')(this, value)
  }

  get checkOnClickNode() {
    return boolGetter('check-on-click-node')(this)
  }

  set checkOnClickNode(value) {
    boolSetter('check-on-click-node')(this, value)
  }

  // 父子结点是否使用严格不关联模式
  get checkStrictly() {
    return boolGetter('check-strictly')(this)
  }

  set checkStrictly(value) {
    boolSetter('check-strictly')(this, value)
  }

  // 默认是否折叠所有树结点
  get defaultFoldAll() {
    return boolGetter('default-fold-all')(this)
  }

  set defaultFoldAll(value) {
    boolSetter('default-fold-all')(this, value)
  }

  get disabled() {
    return boolGetter('disabled')(this)
  }

  set disabled(value) {
    boolSetter('disabled')(this, value)
  }

  // 是否点击结点的时候，切换展开、折叠状态
  get expandOnClickNode() {
    return boolGetter('expand-on-click-node')(this)
  }

  set expandOnClickNode(value) {
    boolSetter('expand-on-click-node')(this, value)
  }

  get indentUnit() {
    return intGetter('indent-unit')(this) ?? 16
  }

  set indentUnit(value) {
    intSetter('indent-unit')(this, value)
  }

  get idField() {
    return strGetter('id-field')(this)
  }

  set idField(value) {
    strSetter('id-field')(this, value)
  }

  get labelField() {
    return strGetter('label-field')(this)
  }

  set labelField(value) {
    strSetter('label-field')(this, value)
  }

  get search() {
    return strGetter('search')(this)
  }

  set search(value) {
    strSetter('search')(this, value)
  }

  get wrap() {
    return boolGetter('wrap')(this)
  }

  set wrap(value) {
    boolSetter('wrap')(this, value)
  }

  get multiple() {
    return boolGetter('multiple')(this)
  }

  set multiple(value) {
    boolSetter('multiple')(this, value)
  }

  select(data: NodeData) {
    this.#toggleCheck(data.value, true)
  }

  deselect(data: NodeData) {
    this.#toggleCheck(data.value, false)
  }

  clearSelected() {
    this.#batchToggleCheck(this.checked, false)
  }

  override connectedCallback() {
    super.connectedCallback()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'search') {
      this.generateViewData()
    } else if (attrName === 'wrap') {
      this._resetCalculated()
      this.redraw()
      this.restoreAnchor()
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
  internalKeyMethod(data: any) {
    if (typeof this.keyMethod === 'function') return this.keyMethod(data)
    if (typeof this.idField === 'string') return data[this.idField]
    return data.id
  }

  override filterMethod(data: any[]): Promise<any[]> {
    if (!this.search) return Promise.resolve(data)

    const len = data.length
    const results: VirtualNode[] = []
    // 第一遍标记需要保留的条目
    for (let i = 0; i < len; i += 1) {
      const vItem = data[i]
      if (this.internalLabelMethod(vItem.data).includes(this.search)) {
        vItem._retain = true
        let parent = vItem.parent
        while (parent) {
          parent._retain = true
          parent = parent.parent
        }
      }
    }

    // 第二遍，提取数据，并移除标识
    return new Promise(resolve => {
      setTimeout(() => {
        for (let i = 0; i < len; i += 1) {
          const vItem = data[i]
          if (vItem._retain) {
            results.push(vItem)
            vItem._retain = undefined
          }
        }
        resolve(results)
      })
    })
  }

  _renderItemClass($item: HTMLElement, vitem: VirtualNode) {
    $item.classList.add('node-item')
    $item.classList.toggle(
      'node-item-active',
      String(vitem.virtualKey) === this.activeKey
    )
    $item.style.paddingLeft = this.#indent(vitem) + 'px'
  }
  _renderItemArrow($item: HTMLElement, vitem: VirtualNode) {
    // 折叠箭头
    let $toggle = $item.querySelector('.node-toggle')
    if (!$toggle) {
      $toggle = document.createElement('span')
      $toggle.className = 'node-toggle'
      $item.children.length
        ? $item.insertBefore($toggle, $item.firstElementChild)
        : $item.appendChild($toggle)
    }
    if (this.hasChild(vitem)) {
      $toggle.classList.remove('is-leaf')
      $toggle.classList.toggle('folded', !vitem.expanded)
      $toggle.classList.toggle('expanded', !!vitem.expanded)
    } else {
      $toggle.classList.remove('folded')
      $toggle.classList.remove('expanded')
      $toggle.classList.add('is-leaf')
    }
  }
  _renderItemCheckable($item: HTMLElement, vitem: VirtualNode) {
    // 选择区
    let $check = $item.querySelector('.node-check')
    if (!this.checkable) {
      if ($check) $item.removeChild($check)
    } else {
      let $input: HTMLInputElement
      let $label: HTMLLabelElement
      if (!$check) {
        $check = document.createElement('span')
        $check.className = 'node-check'
        if ($item.lastElementChild!.classList.contains('node-label')) {
          $item.insertBefore($check, $item.lastElementChild)
        } else {
          $item.appendChild($check)
        }
        $input = $check.appendChild(document.createElement('input'))
        $input.name = 'node-check-name'
        $input.className = 'node-check-input'
        $label = $check.appendChild(document.createElement('label'))
        $label.classList.add('node-check-label')
      } else {
        $input = $check.querySelector('input')!
        $label = $check.querySelector('label')!
      }

      $input.id = `node-check-${vitem.virtualKey}-${this.uniqCid}`
      $label.setAttribute('for', $input.id)

      boolSetter('checked')($input, vitem.checked)
      boolSetter('disabled')(
        $input,
        this.disableCheckMethod?.(vitem.data) ?? false
      )
      $input.setAttribute('data-tree-node-key', vitem.virtualKey)

      // radio 单选
      if (!this.multiple) {
        $input.setAttribute('type', 'radio')
      }
      // 多选
      else {
        $input.setAttribute('type', 'checkbox')
        const isIndeterminate = !this.checkStrictly && vitem.indeterminate
        $input.classList.toggle('indeterminate', isIndeterminate)
        $input.indeterminate = isIndeterminate
      }
    }
  }
  _renderItemContent($item: HTMLElement, vitem: VirtualNode) {
    // 内容文本
    let $label = $item.querySelector('.node-label') as HTMLElement
    let $labelText: HTMLSpanElement
    if (!$label) {
      $label = $item.appendChild(document.createElement('span'))
      $labelText = $label.appendChild(document.createElement('span'))
      $label.classList.add('node-label')
    } else {
      $labelText = $label.querySelector('span')!
    }
    const text = this.internalLabelMethod(vitem.data)
    if (this.search && this.search.length) {
      $labelText.innerHTML = this.parseHighlight(text, this.search)
        .map(textSlice => {
          return `<span class="${textSlice.highlight ? 'highlight' : ''}">${
            textSlice.text
          }</span>`
        })
        .join('')
    } else {
      $labelText.innerHTML = text
    }
  }
  override itemRender($item: HTMLElement, vitem: VirtualNode) {
    this._renderItemClass($item, vitem)
    this._renderItemArrow($item, vitem)
    this._renderItemCheckable($item, vitem)
    this._renderItemContent($item, vitem)
  }

  disableActiveMethod(data: any) {
    return false
  }

  disableToggleMethod(data: any) {
    return false
  }

  disableCheckMethod(data: any) {
    return false
  }

  /**
   * 将某个条目设置为激活（高亮）状态
   */
  active(virtualKey: string, options?: any) {
    if (!this.activable) return

    const oldKey = this.activeKey ?? ''
    const newItem = this.getVirtualItemByKey(virtualKey) as VirtualNode
    if (!newItem) return
    this.activeKey = virtualKey
    const $newNode = this.getNodeByVirtualKey(virtualKey)
    this.itemRender($newNode, newItem)

    const oldItem = this.getVirtualItemByKey(oldKey) as VirtualNode
    const $oldNode = this.getNodeByVirtualKey(oldKey)
    if ($oldNode) {
      this.itemRender($oldNode, oldItem)
    }

    if (!options || !options.preventEmit) {
      dispatchEvent(this, 'active', {
        detail: { key: virtualKey, oldKey },
      })
    }
  }

  /**
   * 获取当前激活结点的 key
   */
  getActive() {
    return this.activeKey
  }

  /**
   * 清空激活的条目
   */
  clearActive(options?: { preventEmit?: boolean }) {
    if (this.activeKey) {
      const virtualKey = this.activeKey
      this.activeKey = null
      if (!options || !options.preventEmit) {
        dispatchEvent(this, 'inactive', {
          detail: { key: virtualKey },
        })
      }
    }
  }

  // API，通过 virtualKey 展开结点
  expand(virtualKey: string) {
    const node = this.getVirtualItemByKey(virtualKey) as VirtualNode
    if (node) return this.#expand(node)
  }

  // API，通过 virtualKey 折叠结点
  fold(virtualKey: string) {
    const node = this.getVirtualItemByKey(virtualKey) as VirtualNode
    if (node) return this.#fold(node)
  }

  // API，通过 virtualKey 切换结点的展开、折叠状态
  toggle(virtualKey: string) {
    const node = this.getVirtualItemByKey(virtualKey) as VirtualNode
    if (!node) return
    if (node.expanded) this.#fold(node)
    else this.#expand(node)
  }

  // API，全部结点折叠
  foldAll() {
    ;(this.virtualData as VirtualNode[]).forEach(node => {
      if (node.children) {
        node.expanded = false
      }
    })

    this.#batchUpdateFold = true
    this.#updateFold(this.virtualData as VirtualNode[])
    this.#batchUpdateFold = false
  }

  // API，全部结点展开
  expandAll() {
    ;(this.virtualData as VirtualNode[]).forEach(node => {
      if (node.children) node.expanded = true
    })

    this.#batchUpdateFold = true
    this.#updateFold(this.virtualData as VirtualNode[])
    this.#batchUpdateFold = false
  }

  /**
   * 切换指定 key 的条目的选中状态
   */
  #toggleCheck(virtualKey: string, value?: boolean, options: any = {}) {
    if (!this.checkable) return

    const vitem = this.getVirtualItemByKey(virtualKey) as VirtualNode
    if (!vitem || vitem.checked === value) return

    // 单选模式
    if (!this.multiple) {
      this.#toggleRadio(vitem, options)
      return
    }

    // 多选模式
    this.#batchToggleCheck([virtualKey], value, options)
  }

  // 单选模式
  #toggleRadio(vitem: VirtualNode, options: any) {
    if (this.#lastChecked) {
      // 点击已选中的单选项，不用处理
      if (this.#lastChecked === vitem) return
      this.#updateCheck(this.#lastChecked, false, options.toggleCheckEvent)
      dispatchEvent(this, 'select-list:deselect', {
        detail: {
          value: {
            label: this.internalLabelMethod(this.#lastChecked.data),
            value: this.#lastChecked.virtualKey,
          },
        },
      })
    }
    this.#updateCheck(vitem, true, options.toggleCheckEvent)
    this.#lastChecked = vitem
    dispatchEvent(this, 'select-list:select', {
      detail: {
        value: {
          value: vitem.virtualKey,
          label: this.internalLabelMethod(vitem.data),
        },
      },
    })
    dispatchEvent(this, 'select-list:change')
  }

  // 多选模式
  // 无需联动的情况
  #batchToggleCheckStrictly(
    vItems: VirtualNode[],
    value: boolean,
    options: any = {}
  ) {
    const disabled =
      typeof options.disabled === 'boolean' ? options.disabled : false

    const checked =
      typeof value === 'boolean' ? value : !vItems.every(vitem => vitem.checked)
    vItems.forEach(vitem => {
      if (disabled || !this.disableCheckMethod(vitem.data)) {
        this.#updateCheck(vitem, checked, options.toggleCheckEvent)
      }
    })
  }

  // 需要联动的情况
  // 所有子孙结点，切换为全选或者全不选，但 disabled 的结点除外
  #batchToggleCheckNonStrictly(
    vItems: VirtualNode[],
    value: any,
    options: any = {}
  ) {
    const disabled =
      typeof options.disabled === 'boolean' ? options.disabled : false

    if (!disabled) {
      vItems = vItems.filter(vitem => !this.disableCheckMethod(vitem.data))
      if (!vItems.length) return
    }

    const descendant = flatten(vItems.map(this.#descendant.bind(this)))

    // 不处理的结点（disabled）
    const excluded: VirtualNode[] = []
    // 叶子结点
    const leaves: VirtualNode[] = []

    // 处理所有结点，包含不可用的
    if (disabled) {
      descendant.forEach(vitem => {
        if (isEmpty(vitem.children)) {
          leaves.push(vitem)
        }
      })
    }
    // 排除不可用的结点
    else {
      descendant.forEach(vitem => {
        if (this.disableCheckMethod(vitem.data)) {
          excluded.push(vitem)
        } else if (isEmpty(vitem.children)) {
          leaves.push(vitem)
        }
      })
    }

    let checked: boolean
    // value 无传递（如鼠标点击切换的情况），
    // 本次操作是否 checked 根据 nodes 下所有叶子结点确定，
    // nodes 下无叶子，则 nodes 已经是叶子，以 nodes 确定
    if (value == null) {
      checked = !(leaves.length
        ? leaves.every(leaf => leaf.checked)
        : vItems.every(node => node.checked))
    } else {
      checked = !!value
    }

    // 只需更新 nodes 下的叶子结点，所有祖先结点，都通过叶子结点往上推断出状态
    // （nodes 也可能是叶子结点，因此也需要一并处理）
    {
      leaves.forEach(vitem => {
        this.#updateCheck(vitem, checked, options.toggleCheckEvent)
        this.#updateIndeterminate(vitem, false)
      })
      vItems.forEach(vitem => {
        this.#updateCheck(vitem, checked, options.toggleCheckEvent)
        this.#updateIndeterminate(vitem, false)
      })
    }

    // 从受影响的叶子结点（以及 nodes 自身）往祖先结点方向，更新选中、半选中状态，
    // excluded 排除的结点，由于没有切换，也需要往上刷新，以确保半选正确
    {
      leaves.forEach(vitem =>
        this.#updateAncestorFrom(vitem, options.toggleCheckEvent)
      )
      vItems.forEach(vitem =>
        this.#updateAncestorFrom(vitem, options.toggleCheckEvent)
      )
      excluded.forEach(vitem => {
        if (vitem.checked !== checked)
          this.#updateAncestorFrom(vitem, options.toggleCheckEvent)
      })
    }
  }

  #batchToggleCheck(virtualKeys: string[], value: any, options: any = {}) {
    // 单选模式，没有批量选择功能，直接返回
    if (!this.multiple) return

    const vitems = uniqBy(
      vitem => vitem.virtualKey,
      virtualKeys.map(this.getVirtualItemByKey.bind(this))
    ) as VirtualNode[]

    if (!vitems.length) return

    options = merge({}, options, { toggleCheckEvent: {} })

    if (this.checkStrictly) {
      this.#batchToggleCheckStrictly(vitems, value, options)
    } else {
      this.#batchToggleCheckNonStrictly(vitems, value, options)
    }

    if (!options.preventEmit && !isEmpty(options.toggleCheckEvent)) {
      Object.keys(options.toggleCheckEvent).forEach(eventName => {
        const data = options.toggleCheckEvent[eventName]
        if (data.length === 1) {
          dispatchEvent(this, eventName, {
            detail: {
              value: {
                value: this.internalKeyMethod(data[0]),
                label: this.internalLabelMethod(data[0]),
              },
            },
          })
        }
      })
      dispatchEvent(this, 'select-list:change', {
        detail: {
          value: this.checkedData.map(data => {
            return {
              label: this.internalLabelMethod(data),
              value: this.internalKeyMethod(data),
            }
          }),
        },
      })
    }
  }

  // 更新指定条目的选中状态（数据 & 视图）
  #updateCheck(vitem: VirtualNode, checked: boolean, event: any = {}) {
    if (vitem.checked !== checked) {
      const eventName = checked ? 'select-list:select' : 'select-list:deselect'
      if (!event[eventName]) {
        event[eventName] = []
      }
      event[eventName].push({
        value: vitem.virtualKey,
        label: this.internalLabelMethod(vitem.data),
      })
    }

    vitem.checked = checked
    this._checkedSet[checked ? 'add' : 'delete'](vitem as VirtualNode)

    const $item = this.getNodeByVirtualKey(vitem.virtualKey)
    if ($item) this.itemRender($item, vitem)
  }

  // 更新指定条目的半选中状态（数据 & 视图）
  #updateIndeterminate(vitem: VirtualNode, value: boolean) {
    vitem.indeterminate = value
    const $item = this.getNodeByVirtualKey(vitem.virtualKey)
    if ($item) {
      const $input = $item.querySelector('input') as HTMLInputElement
      $input.indeterminate = value
      $input.classList.toggle('indeterminate', value)
    }
  }

  // 检查子结点列表的状态
  // [子结点选中状态 0|1|0.5，有无半选中的子结点]
  // 1：全部选中
  // 0：全部没有选中
  // 0.5：部分选中
  #childrenStatus(vitem: VirtualNode) {
    const children = vitem.children
    let count = children?.length

    // 1. 无子结点，所以【无选中的子结点，无半选的子结点】
    if (!count) return [0, false]

    let hasIndeterminateChild = false
    let checkedCount = 0
    while (count--) {
      const child = children[count]
      if (child.checked) checkedCount += 1
      else if (child.indeterminate) hasIndeterminateChild = true
    }

    // 2. 【子节点全选，无半选的子结点】
    if (checkedCount === children.length) {
      return [1, false]
    }

    // 3. 【子节点部分选中】
    if (checkedCount > 0) {
      return [0.5, true]
    }

    // 4. 【子节点全部没有选中】
    return [0, hasIndeterminateChild]
  }

  /**
   * 从指定的结点开始，往祖先结点方向和，
   * 联动更新祖先结点的选中、半选中状态
   */
  #updateAncestorFrom(node: VirtualNode, event: any) {
    const ancestor = this.#ancestor(node).reverse()

    // 子孙级存在半选，则祖先链条往上全部都是半选
    let hasIndeterminate = false

    while (ancestor.length) {
      const parent = ancestor.pop()
      // 已达根级别
      if (!parent) break

      if (hasIndeterminate) {
        this.#updateCheck(parent, false, event)
        this.#updateIndeterminate(parent, true)
        continue
      }

      // 根据子结点的选中状态，更新 parent 自身状态
      // 更新父结点的半选中状态
      const [checkedStatus, indeterminate] = this.#childrenStatus(parent)
      if (indeterminate) {
        hasIndeterminate = true
        this.#updateCheck(parent, false, event)
        this.#updateIndeterminate(parent, true)
        continue
      }

      // 所有子结点选中时，父节点也选中
      this.#updateCheck(parent, checkedStatus === 1, event)
      // 部分子结点未选中时，父结点半选
      this.#updateIndeterminate(parent, checkedStatus === 0.5)
    }
  }

  #updateFold(vItems: VirtualNode[]) {
    const expandItems = vItems.filter(vItem => vItem.expanded)
    const foldedItems = vItems.filter(vItem => !vItem.expanded)
    foldedItems.forEach(vItem => {
      this.#fold(vItem)
    })
    expandItems.forEach(vItem => {
      this.#expand(vItem)
    })
  }

  // 展开结点
  #expand(vitem: VirtualNode, preventEmit = false) {
    vitem.expanded = true
    const listKeys = this.#descendant(vitem)
      .filter(child => this.visible(child))
      .map(child => child.virtualKey)

    if (listKeys.length) {
      this.showByKeys(listKeys, this.#batchUpdateFold)
    }

    if (!preventEmit) {
      dispatchEvent(this, 'expand', {
        detail: { key: vitem.virtualKey },
      })
    }
  }

  // 折叠结点
  #fold(node: VirtualNode, preventEmit = false) {
    node.expanded = false
    const children = this.#descendant(node)
    const listKeys = children.map(child => child.virtualKey)

    if (listKeys.length) {
      this.hideByKeys(listKeys, this.#batchUpdateFold)
    }

    // 如果折叠的结点，包含当前激活的结点，则取消激活状态
    if (
      this.activeKey &&
      children.findIndex(child => child.virtualKey === this.activeKey) !== -1
    ) {
      const virtualKey = this.activeKey
      this.activeKey = null

      if (!preventEmit) {
        dispatchEvent(this, 'inactive', {
          detail: { key: virtualKey },
        })
      }
    }

    if (!preventEmit) {
      dispatchEvent(this, 'fold', {
        detail: { key: node.virtualKey },
      })
    }
  }

  /**
   * 获取指定结点的所有后代结点
   */
  #descendant(node: VirtualNode) {
    const pickChild = (node: VirtualNode, children: VirtualNode[] = []) => {
      if (!node.children) return children
      node.children.forEach(child => {
        children.push(child)
        pickChild(child, children)
      })
      return children
    }
    return pickChild(node)
  }

  /**
   * 获取指定结点的所有祖先结点
   */
  #ancestor(node: VirtualNode) {
    const result = []
    while (node.parent) {
      result.push(node.parent)
      node = node.parent
    }
    return result
  }

  /**
   * 获取指定结点的所有兄弟结点（含自己）
   */
  #siblings(node: VirtualNode) {
    const parent = node.parent
    if (parent) {
      return parent.children ?? []
    }
    // 顶层结点
    return this.virtualData.filter(node => !(node as VirtualNode).parent)
  }

  // override，根据树形数据，生成虚拟数据
  override async virtualMap(data: NodeData[]): Promise<VirtualNode[]> {
    const virtualData: VirtualNode[] = []

    let index = 0
    const convert = (data: NodeData) => {
      const virtualKey = this.internalKeyMethod(data) ?? index
      const vnode = new VirtualNode({
        virtualKey,
        height: this.defaultItemSize,
        data,
        checked: false,
        expanded: true,
        children: [],
      })
      virtualData.push(vnode as VirtualNode)
      index += 1

      const len = data.children?.length
      if (len) {
        for (let i = 0; i < len; i += 1) {
          const childNode = convert(data.children![i])
          childNode.parent = vnode
          childNode.parentKey = vnode.virtualKey
          vnode.children.push(childNode)
        }
      }

      return vnode
    }

    data.forEach(convert)
    return virtualData
  }

  override render() {
    super.render()
  }

  // 获取结点的层级
  level(node: VirtualNode) {
    let level = 1
    while (node.parent) {
      level += 1
      node = node.parent
    }
    return level
  }

  /**
   * 检查条目是否是顶层条目
   */
  isTopLevel(node: VirtualNode) {
    return !!node.parent
  }

  /**
   * 检查条目是否拥有子结点
   */
  hasChild(node: VirtualNode) {
    return node.children && node.children.length > 0
  }

  /**
   * 检查条目当时是否应该可见
   */
  visible(node: VirtualNode) {
    if (node.parent && (!node.parent.expanded || !this.visible(node.parent))) {
      return false
    }
    return true
  }

  parseHighlight(label: string, highlightText: string) {
    return parseHighlight(label, highlightText)
  }

  // 在容器上代理结点的点击事件
  // 根据点击的元素，分发事件处理逻辑
  // 1. 如果点击箭头按钮，则切换折叠、展开
  // 2. 如果点击的是复选框、单选框，则处理选中逻辑
  // 3. 如果点击的是内容文本区，则处理激活逻辑
  #onClick(e: MouseEvent) {
    let nodeItem!: HTMLElement
    let el = e.target as HTMLElement

    let doToggle = false
    let doCheck = false
    let doActive = false

    while (el) {
      if (el === e.currentTarget) break
      // 1. 点击切换按钮
      if (el.classList.contains('node-toggle')) {
        nodeItem = el.parentElement as HTMLElement
        doToggle = true
        break
      }

      // 2. 点击选择框（label 会间接触发 input 的事件，为了避免重复处理，只处理 input 事件）
      if (el.classList.contains('node-check-input')) {
        nodeItem = (el.parentElement as HTMLElement)
          .parentElement as HTMLElement
        if ((el as HTMLInputElement).disabled) {
          // 取消本次操作
          break
        }
        doCheck = true
        break
      }

      // 3. 点击文本区
      if (el.classList.contains('node-label')) {
        nodeItem = el.parentElement as HTMLElement
        doActive = true
        // 如果配置了点击结点切换折叠状态
        if (this.expandOnClickNode) {
          doToggle = true
        }
        // 如果配置了点击结点切换选中状态
        if (this.checkOnClickNode) {
          doCheck = true
        }
        break
      }

      if (el.classList.contains('node-item')) {
        nodeItem = el
        doActive = true
        break
      }
      el = el.parentNode as HTMLElement
    }
    if (!nodeItem) return

    // virtualKey 必定为 string，number 也会被转换成 string（dataset 中）
    const virtualKey = nodeItem.dataset.virtualKey!
    if (doToggle) {
      if (
        !this.disableToggleMethod(this.getVirtualItemByKey(virtualKey).data)
      ) {
        this.toggle(virtualKey)
      }
    }
    if (doCheck) {
      if (!this.disableCheckMethod(this.getVirtualItemByKey(virtualKey).data)) {
        this.#toggleCheck(virtualKey)
      }
    }
    if (doActive) {
      if (
        !this.disableActiveMethod(this.getVirtualItemByKey(virtualKey).data)
      ) {
        this.active(virtualKey)
      }
    }

    dispatchEvent(this, 'click', {
      detail: { key: virtualKey },
    })
  }

  /**
   * 计算层级缩进的像素
   */
  #indent(node: VirtualNode) {
    return (this.level(node) - 1) * this.indentUnit
  }

  /**
   * 计算节点样式，主要是处理层次缩进
   */
  #nodeStyle(node: VirtualNode) {
    const indent = this.#indent(node)
    return {
      paddingLeft: `${indent}px`,
    }
  }
}

if (!customElements.get('bl-tree')) {
  customElements.define('bl-tree', BlocksTree)
}
