import VList, { VirtualItem } from '../vlist/index.js'
import '../scrollable/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { find, findLast, forEach } from '../../common/utils.js'
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
  __font_size_base,
  __font_size_small,
  __bg_base,
  __color_danger,
} from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import parseHighlight from '../../common/highlight.js'

const Direction = {
  Vertical: 'vertical',
  Horizontal: 'horizontal'
}

const template = document.createElement('template')
template.innerHTML = `
<style>
:host([direction="horizontal"]) #list,
:host(:not([direction="horizontal"])) #list {
  flex-flow: column nowrap;
  width: 100%;
}

/* 结点容器 */
.item {
  min-width: var(--item-height);
  width: auto;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 20px;
  font-size: var(font-size-small, ${__font_size_small});
}
.item:hover {
  background-color: var(--bg-base, ${__bg_base});
}
.item.item-active {
  color: var(--color-primary, ${__color_primary});
  /*background-color: $--color-primary-light-9;*/
}

/* 子节点折叠、展开箭头 */
.node-toggle {
  flex: 0 0 24px;
  position: relative;
  display: block;
  width: 24px;
  height: $height;
  text-align: center;
}

.node-toggle.folded:before,
.node-toggle.expanded:before {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: auto;
  border: 4px dashed transparent;
  border-right: 0 none;
  border-left: 5px solid transparent;
  transition: all .2s;
}
.node-toggle.folded:before {
  border-left-color: #c0c4cc;
}
.node-toggle.expanded:before {
  border-left-color: #c0c4cc;
  transform: rotate(90deg);
}
.node-toggle.folded:hover:before,
.node-toggle.expanded:hover:before {
  border-left-color: #888;
}

/* 结点的选择框 */
.node-check {
  overflow: hidden;
  flex: 0 0 19px;
  position: relative;
  width: 19px;
  height: $height;
  text-align: left;
  line-height: $height;
}

.node-check input {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  /* 隐藏 */
  top: -100px;
  left: -100px;
  visibility: hidden;
}

.node-check label {
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  margin: auto;
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  background: #fff;
  font-size: 0;
  &:hover {
    border-color: var(--color-primary, ${__color_primary});
  }
}
/* 复选框的圆角 2 px */
.node-check input[type="checkbox"] + label {
  border-radius: 2px;
}
/* 单选的圆角，正圆形 */
.node-check input[type="radio"] + label {
  border-radius: 50%;
}

/* 选中状态的，高亮颜色 */
.node-check input:checked + label {
  border-color: var(--color-primary, ${__color_primary});
  background-color: var(--color-primary, ${__color_primary});
}
/* 半选中状态的，高亮颜色 */
.node-check input[type="checkbox"]:indeterminate + label,
// IE 11
.node-check input.indeterminate[type="checkbox"] + label {
  border-color: var(--color-primary, ${__color_primary});
  background-color: var(--color-primary, ${__color_primary});
}

// 选中状态下的复选框内部样式
.node-check input:checked[type="checkbox"] + label:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform .15s ease-in .05s;
  transform: rotate(45deg) scaleY(1);
  transform-origin: center;
}
// 选中状态下的单选框内部样式
.node-check input:checked[type="radio"] + label:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
}
// 半选中状态下的复选框内部样式
.node-check input:indeterminate[type="checkbox"] + label:after,
/* IE 11 */
.node-check input.indeterminate[type="checkbox"] + label:after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
}

/* 禁用状态 */
.node-check input:disabled + label,
.node-check input:disabled + label:hover {
  border-color: var(--border-color-base, ${__border_color_base});
  background-color: var(--bg-base, ${__bg_base});
  cursor: not-allowed;
}
.node-check input:disabled:checked[type="checkbox"] + label:after {
  border-color: var(--border-color-base, ${__border_color_base});
}
.node-check input:disabled:checked[type="radio"] + label:after {
  background: var(--border-color-base, ${__border_color_base});
}

/* 结点 label 文本 */
.node-label {
  flex: 1 1 100%;
  padding: (($height - 20) / 2) 0;
  user-select: none;
}

.node-label .highlight {
  color: var(--color-danger, ${__color_danger});
}

</style>
`

const itemTemplate = document.createElement('div')
itemTemplate.innerHTML = `<div
:key="vlistItemKey"
:data-tree-node-key="vlistItemData.key"
:style="_nodeStyle(vlistItemData)"
:class="{'node-item-active': vlistItemData === activeNode}"
class="node-item"
style="user-select:none;">
<!-- 折叠箭头 -->
<span
  v-if="hasChild(vlistItemData) && !vlistItemData.expanded"
  key="icon"
  class="node-toggle folded" />
<span
  v-else-if="hasChild(vlistItemData) && vlistItemData.expanded"
  key="icon"
  class="node-toggle expanded" />
<span
  v-else
  key="icon"
  class="node-toggle is-leaf" />

<!-- 选择区 -->
<span
  v-if="checkable !== 'none'"
  key="node-check"
  class="node-check">
  <!-- radio 单选 -->
  <input
    v-if="checkable === 'single'"
    :id="node-check-$ {vlistItemKey}-$ {uniqCid}"
    type="radio"
    name="node-check-name"
    class="node-check-input"
    :checked="vlistItemData.checked"
    :disabled="disableCheckMethod(vlistItemData.data)"
    :data-tree-node-key="vlistItemData.key">
  <!-- checkbox 多选 -->
  <input
    v-else
    :id="node-check-$ {vlistItemKey}-$ {uniqCid}"
    type="checkbox"
    name="node-check-name"
    class="node-check-input"
    :class="{indeterminate: !checkStrictly && vlistItemData.indeterminate}"
    :indeterminate="!checkStrictly && vlistItemData.indeterminate"
    :checked="vlistItemData.checked"
    :disabled="disableCheckMethod(vlistItemData.data)"
    :data-tree-node-key="vlistItemData.key">
  <label :for="node-check-$ {vlistItemKey}-$ {uniqCid}" />
</span>

<!-- 内容文本 -->
<span
  key="label"
  class="node-label el-tree-node__label"
  :class="[labelClassMethod(vlistItemData.data)]">
  <template v-if="highlightText && highlightText.length">
    <span
      v-for="(textSlice, index) in parseHighlight(internalLabelMethod(vlistItemData.data), highlightText)"
      :key="index"
      :class="{highlight: textSlice.highlight}">{{ textSlice.text }}</span>
  </template>
  <template v-else>
    {{ internalLabelMethod(vlistItemData.data) }}
  </template>
</span>
</div>`

class BlocksTree extends VList {
  itemRender($item, vitem) {
    $item.dataset.treeNodeKey = vitem.virtualKey


    const label = vitem.data[this.labelField] ?? ''
    $item.classList.add('item')
    $item.innerHTML = label
  }

  static get observedAttributes() {
    return super.observedAttributes.concat(['border', 'disabled', 'disabled-field', 'id-field', 'label-field', 'selectable', 'stripe'])
  }

  constructor() {
    super()
    const shadowRoot = this.shadowRoot
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$scrollable = shadowRoot.getElementById('scrollable')
    this.$listSize = shadowRoot.getElementById('list-size')
    this.$list = shadowRoot.getElementById('list')
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
    return intGetter('default-item-size', parseInt(getComputedStyle(this).getPropertyValue('--item-height'), 10))(this)
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

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)
  }

  convertData(data) {
    const virtualItems = []

    let index = 0
    const convert = data => {
      const virtualKey = this.keyMethod?.(data) ?? index++
      const vitem = new VirtualItem({
        virtualKey,
        height: this.defaultItemSize,
        data,
        children: [],
      })
      virtualItems.push(vitem)
      const len = data.children?.length
      if (len) {
        for (let i = 0; i < len; i += 1) {
          const childNode = convert(data.children[i])
          childNode.parent = vitem
          childNode.parentKey = vitem.virtualKey
          vitem.children.push(childNode)
        }
      }
      return vitem
    }

    data.forEach(convert)
    return virtualItems
  }

  render() {
    super.render()
  }  

  // 提取 data
  _pluckData(virtualItems) {
    const data = []
    for (let i = 0, len = virtualItems.length; i < len; i += 1) {
      data.push(virtualItems[i].data)
    }
    return data
  }

  _updateListSize() {
    const { itemHeightStore } = this
    if (itemHeightStore) {
      if (this.direction === Direction.Horizontal) {
        this.$listSize.style.height = ''
        this.$listSize.style.width = `${itemHeightStore.read(itemHeightStore.maxVal)}px`
      }
      else {
        this.$listSize.style.width = ''
        this.$listSize.style.height = `${itemHeightStore.read(itemHeightStore.maxVal)}px`
      }
    }
  }

  // 重置高度的已计算状态，用于已计算出来的值全部失效的情况
  // 例如垂直滚动时，容器宽度变化，导致每项的换行情况可能发生变化
  // 此时需要彻底重新计算
  _resetCalculated() {
    const virtualItems = this.virtualItems
    let i = virtualItems.length
    while (i--) virtualItems[i].calculated = false
  }

  // `index`: 数据在 virtualViewItems 中的 index
  _itemSize(index) {
    if (index >= this.itemHeightStore.maxVal) index = this.itemHeightStore.maxVal - 1
    return this.itemHeightStore.readSingle(index)
  }

  // `index`: 数据在 virtualViewItems 中的 index
  _itemOffset(index) {
    // 0 ～ 上一项的高度累加
    return this.itemHeightStore.read(index)
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
