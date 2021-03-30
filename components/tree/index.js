import '../scrollable/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { rgbaFromHex } from '../../common/color.js'
import { definePrivate } from '../../common/definePrivate.js'
import {
  __font_family,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
  __height_base,
  __border_color_light,
  __fg_base,
} from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import BinaryIndexedTree from '../../common/binaryIndexedTree.js'
import parseHighlight from '../../common/highlight.js'

const TEMPLATE_CSS = `
<style>
:host {
  --item-height: var(--height-base, ${__height_base});

  display: block;
  box-sizing: border-box;
  font-family: var(--font-family, ${__font_family});
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  contain: content;
  font-size: 14px;
  color: var(--fg-base, ${__fg_base});
}
:host([disabled]) {
  color: var(--fg-disabled, ${__fg_disabled});
}


#scrollable {
  box-sizing: border-box;
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#list-size {
  box-sizing: border-box;
  width: 100%;
}
#list {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
}

.item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  height: var(--item-height);
}
:host([disabled]) .item,
.item[disabled] {
  cursor: not-allowed;
  color: var(--fg-disabled, ${__fg_disabled});
}

:host([stripe]) .item:nth-child(even) {
  background-color: rgba(0,0,0,.025);
}

:host([border]) .item:before,
:host([border]) .item:after {
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: 0;
  display: block;
  content: '';
  height: 1px;
  background: rgba(0,0,0,.05);
  transform: scale(1, 0.5);
}
:host([border]) .item:before {
  top: -0.5px;
}
:host([border]) .item:after {
  bottom: -0.5px;
}
:host([border]) .item:first-child:before,
:host([border]) .item:last-child:after {
  display: none;
}


.label {
  flex: 1 1 auto;
  padding: 4px;
}
.prefix:empty+.label {
  padding-left: 12px;
}
.prefix {
  flex: 0 0 auto;
}
.suffix {
  flex: 0 0 24px;
}
.item.selected .suffix:after {
  position: relative;
  display: block;
  content: '';
  width: 8px;
  height: 5px;
  margin: auto;
  border-width: 0;
  border-style: solid;
  border-color: var(--color-primary, ${__color_primary});
  border-left-width: 1px;
  border-bottom-width: 1px;
  transform: rotate(-45deg);
}
.item:hover {
  background-color: ${rgbaFromHex(__color_primary, .1)};
}

</style>
`
const TMEPLATE_HTML = `
<bl-scrollable id="scrollable">
  <div id="list-size"></div>
  <div id="list"></div>  
</bl-scrollable>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

const itemTemplate = document.createElement('template')
itemTemplate.innerHTML = `
<div class="item">
  <div class="prefix"></div>
  <div class="label"></div>
  <div class="suffix"></div>
</div>
`

class TreeNode {
  constructor(options = {}) {
    // key
    this.key = options.key
    // 父结点的 key
    this.parentKey = options.parentKey
    // 节点的高度
    this.height = options.height
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
    // 原始数据
    this.data = options.data
    // 过滤时临时使用
    this._retain = false
  }
}


class BlocksTree extends HTMLElement {
  static get observedAttributes() {
    return ['border', 'disabled', 'disabled-field', 'id-field', 'label-field', 'selectable', 'stripe']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$scrollable = shadowRoot.getElementById('scrollable')
    this.$listSize = shadowRoot.getElementById('list-size')
    this.$list = shadowRoot.getElementById('list')

    this._$pool = []

    definePrivate(this, '_data', [])
    definePrivate(this, '_nodes', [])
    definePrivate(this, '_selected', [])

    // 数据 key --> VItem 的映射，提高访问性能
    this.keyDataMap = Object.create(null)

    // 高度存储
    // this.itemHeightStore = new BinaryIndexedTree(defaultFrequency, maxVal)




    this.$scrollable.onscroll = this.render.bind(this)
  }

  get activeNode() {
    return this.getAttribute('active-node')
  }

  set activeNode(value) {
    this.setAttribute('active-node', value)
  }

  get data() {
    return this._data
  }

  set data(value) {
    const data = Array.isArray(value) ? value : []
    this._data = data
    this.setData(this.data)
    this.render()
  }

  get disabled() {
    return boolGetter('disabled')(this)
  }

  set disabled(value) {
    boolSetter('disabled')(this, value)
  }

  get disabledField() {
    return this.getAttribute('disabled-field') ?? 'disabled'
  }

  set disabledField(value) {
    this.setAttribute('disabled-field', value)
  }

  get keyField() {
    return this.getAttribute('key-field') || 'id'
  }

  set keyField(value) {
    this.setAttribute('key-field', value)
  }

  get labelField() {
    return this.getAttribute('label-field') || 'label'
  }

  set labelField(value) {
    this.setAttribute('label-field', value)
  }

  get indentUnit() {
    return intGetter('indent-unit', 16)(this)
  }

  set indentUnit(value) {
    intSetter('indent-unit')(this, value)
  }

  get defaultItemSize() {
    return intGetter('default-item-size', 32)(this)
  }

  set defaultItemSize(value) {
    return intSetter('default-item-size')(this, value)
  }

  // 默认是否折叠所有树结点
  get defaultFoldAll() {
    return boolGetter('default-fold-all')(this)
  }

  set defaultFoldAll(value) {
    boolSetter('default-fold-all')(this, value)
  }

  get checkable() {
    return enumGetter('checkable', [null, 'multiple' | 'single'])(this)
  }

  set checkable(value) {
    return enumSetter('checkable', [null, 'multiple' | 'single'])(this, value)
  }

  // 是否点击结点的时候，切换展开、折叠状态
  get expandOnClickNode() {
    return boolGetter('expand-on-click-node')(this)
  }

  set expandOnClickNode(value) {
    boolSetter('expand-on-click-node')(this, value)
  }

  // 父子结点是否使用严格不关联模式
  get checkStrictly() {
    return boolGetter('check-strictly')(this)
  }

  set checkStrictly(value) {
    boolSetter('check-strictly')(this, value)
  }

  // 层级过滤器，0 代表不过滤，其他数值代表需要显示到哪一级的数据
  get levelFilter() {
    return intGetter('level-filter', 0)(this)
  }

  set levelFilter(value) {
    intSetter('level-filter')(this, value)
  }


  render() {
    const itemHeight = parseInt(getComputedStyle(this).getPropertyValue('--item-height'), 10)
    this.$listSize.style.height = `${this.data.length * itemHeight}px`

    const scrollTop = this.$scrollable.scrollTop
    const viewportHeight = this.$scrollable.clientHeight
    const renderCount = Math.ceil(viewportHeight / itemHeight)
    const itemFrom = Math.floor(scrollTop / itemHeight)

    this.$list.style.transform = `translateY(${scrollTop - scrollTop % itemHeight}px)`

    const nodeSlice = this.virtualItems.slice(itemFrom, itemFrom + renderCount)
    const idIndexMap = {}
    nodeSlice.forEach((node, i) => idIndexMap[node.key] = i)

    const $newItems = Array(renderCount)
    let len = this.$list.children.length
    while (len--) {
      const $item = this.$list.removeChild(this.$list.lastElementChild)
      let index = idIndexMap[$item.dataset.id]
      // 复用
      if (index != null) {
        $newItems[index] = $item
      }
      else {
        this._$pool.push($item)
      }
    }

    const selectedMap = Object.create(null)
    forEach(this._selected, id => {
      selectedMap[id] = true
    })

    const { keyField, labelField, disabledField } = this
    let i = -1;
    while (++i < renderCount) {
      const $item = $newItems[i] ?? this._$pool.pop() ?? itemTemplate.content.querySelector('.item').cloneNode(true)
      const node = nodeSlice[i]
      if (!node) return
      const id = node.key ?? ''
      const label = node.data[labelField] ?? ''
      const isDisabled = node.data[disabledField] ?? false
      $item.dataset.id = id
      $item.children[1].innerHTML = label
      if (isDisabled) {
        $item.setAttribute('disabled', '')
      }
      else {
        $item.removeAttribute('disabled')
      }
      if (selectedMap[id]) {
        $item.classList.add('selected')
      }
      else {
        $item.classList.remove('selected')
      }

      this.$list.appendChild($item)
    }
    this._$pool = []
  }

  _selectItem($item) {
    if (this.multiple) {
      $item.classList.toggle('selected')
      this._selected.push($item.dataset.id)
    }
    else {
      forEach(this.$list.children, $child => {
        if ($child !== $item) {
          $child.classList.remove('selected')
        }
        else {
          $child.classList.add('selected')
        }
      })
      this._selected = [$item.dataset.id]
    }
    dispatchEvent(this, 'change', { detail: { value: this.multiple ? this._selected : this._selected[0] } })
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    upgradeProperty(this, 'data')

    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // 从多选改成单选，保留最后一个选择的值
    if (name === 'selectable') {
      if (!this.multiple && this._selected.length) {
        this._selected = [this._selected[this._selected.length - 1]]
      }
    }

    this.render()
  }

  get internalKeyMethod() {
    return typeof this.keyMethod === 'function' ? this.keyMethod
      : typeof this.keyField === 'string' ? data => data[this.keyField]
      : null
  }

  /**
   * 包裹一份数据列表作为组件数据，依赖：传入注入数据
   */
  setData(treeData) {
    // 获取 key 的方法
    const keyMethod = this.internalKeyMethod

    const virtualItems = []

    let index = 0
    const convert = data => {
      const key = keyMethod ? keyMethod(data) : index++
      const node = new TreeNode({
        key,
        height: this.defaultItemSize,
        data,
        children: [],
      })
      virtualItems.push(node)
      const len = data.children?.length
      if (len) {
        for (let i = 0; i < len; i += 1) {
          const childNode = convert(data.children[i])
          childNode.parent = node
          childNode.parentKey = node.key
          node.children.push(childNode)
        }
      }
      return node
    }

    treeData.forEach(convert)

    // 构建 keyDataMap，形成 key-data 映射，方便后续快速查找数据
    const keyDataMap = Object.create(null)
    let i = virtualItems.length
    while (i--) {
      keyDataMap[virtualItems[i].key] = virtualItems[i]
    }

    // 如果存在旧数据，并且配置了自定义 key 字段，
    // 则尝试从旧数据中恢复信息
    const oldKeyDataMap = this.keyDataMap
    if (oldKeyDataMap && keyMethod) {
      let i = virtualItems.length
      while (i--) {
        const wrappedItem = virtualItems[i]
        const oldWrappedItem = oldKeyDataMap[wrappedItem.key]
        if (oldWrappedItem) {
          wrappedItem.expanded = oldWrappedItem.expanded
          wrappedItem.height = oldWrappedItem.height
          wrappedItem.checked = oldWrappedItem.checked
          wrappedItem.indeterminate = oldWrappedItem.indeterminate
        }
      }
    }

    this.virtualItems = virtualItems
    this.keyDataMap = keyDataMap
    // 完成后，抛出事件
    dispatchEvent(this, 'WRAPPED_DATA_CHANGE', virtualItems, keyDataMap)
  }


  /**
   * 计算层级缩进的像素
   */
   _indent(node) {
    return (this.level(node) - 1) * this.indentUnit
  }

  /**
   * 计算节点样式，主要是处理层次缩进
   */
  _nodeStyle(node) {
    const indent = this._indent(node)
    return {
      paddingLeft: `${indent}px`
    }
  }

  parseHighlight(label, highlightText) {
    return parseHighlight(label, highlightText)
  }


  // 在容器上代理结点的点击事件
  // 根据点击的元素，分发事件处理逻辑
  // 1. 如果点击箭头按钮，则切换折叠、展开
  // 2. 如果点击的是复选框、单选框，则处理选中逻辑
  // 3. 如果点击的是内容文本区，则处理激活逻辑
  _onClick(e) {
    let nodeItem
    let el = e.target

    let doToggle = false
    let doCheck = false
    let doActive = false

    while (el) {
      if (el === e.currentTarget) break
      const className = el.className

      // 1. 点击切换按钮
      if (_.includes(className, 'node-toggle')) {
        nodeItem = el.parentNode
        doToggle = true
        break
      }

      // 2. 点击选择框（label 会间接触发 input 的事件，为了避免重复处理，只处理 input 事件）
      if (_.includes(className, 'node-check-input')) {
        nodeItem = el.parentNode.parentNode
        if (el.disabled) {
          // 取消本次操作
          break
        }
        doCheck = true
        break
      }

      // 3. 点击文本区
      if (_.includes(className, 'node-label')) {
        nodeItem = el.parentNode
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

      if (_.includes(className, 'node-item')) {
        nodeItem = el
        doActive = true
        break
      }
      el = el.parentNode
    }
    if (!nodeItem) return

    // treeNodeKey 必定为 string，number 也会被转换成 string（dataset 中）
    const treeNodeKey = nodeItem.dataset.treeNodeKey
    if (doToggle) {
      if (!this.disableToggleMethod(this._getNodeData(treeNodeKey).data)) {
        this.toggle(treeNodeKey)
      }
    }
    if (doCheck) {
      if (!this.disableCheckMethod(this._getNodeData(treeNodeKey).data)) {
        this._toggleCheck(treeNodeKey)
      }
    }
    if (doActive) {
      if (!this.disableActiveMethod(this._getNodeData(treeNodeKey).data)) {
        this.active(treeNodeKey)
      }
    }

    // this.$emit('click', treeNodeKey)
  }

  _updateFold(nodes) {
    const expandNodes = nodes.filter(node => node.expanded)
    const foldedNodes = nodes.filter(node => !node.expanded)
    foldedNodes.forEach(node => {
      this._fold(node)
    })
    expandNodes.forEach(node => {
      this._expand(node)
    })
  }


}

if (!customElements.get('bl-tree')) {
  customElements.define('bl-tree', BlocksTree)
}
