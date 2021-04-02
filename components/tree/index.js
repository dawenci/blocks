import VList, { VirtualItem } from '../vlist/index.js'
import '../scrollable/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { find, findLast, forEach, isEmpty, merge, property, uniqBy, flatten } from '../../common/utils.js'
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
:host {
  --height: 28px;
}

:host([direction="horizontal"]) #list,
:host(:not([direction="horizontal"])) #list {
  flex-flow: column nowrap;
  width: 100%;
}

/* 结点容器 */
.node-item {
  min-width: var(--item-height);
  width: auto;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 20px;
  font-size: var(font-size-small, ${__font_size_small});
}
.node-item:hover {
  background-color: var(--bg-base, ${__bg_base});
}
.node-item.node-item-active {
  color: var(--color-primary, ${__color_primary});
  /*background-color: $--color-primary-light-9;*/
}

/* 子节点折叠、展开箭头 */
.node-toggle {
  flex: 0 0 24px;
  position: relative;
  display: block;
  width: 24px;
  height: var(--height);
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
  transition: all var(--transition-duration, ${__transition_duration});
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
  height: var(--height);
  text-align: left;
  line-height: var(--height);
}
.node-check-input {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  /* 隐藏 */
  top: -100px;
  left: -100px;
  visibility: hidden;
}
.node-check-label {
  box-sizing: border-box;
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
}
.node-check-label:hover {
  border-color: var(--color-primary, ${__color_primary});
}

/* 复选框的圆角 2 px */
.node-check-input[type="checkbox"] + .node-check-label {
  border-radius: 2px;
}
/* 单选的圆角，正圆形 */
.node-check-input[type="radio"] + .node-check-label {
  border-radius: 50%;
}
/* 选中状态的，高亮颜色 */
/* 半选中状态的，高亮颜色 */
.node-check-input[checked] + .node-check-label,
.node-check-input[type="checkbox"]:indeterminate + .node-check-label,
.node-check-input.indeterminate[type="checkbox"] + .node-check-label {
  border-color: var(--color-primary, ${__color_primary});
  background-color: var(--color-primary, ${__color_primary});
}

.node-check-input[type="radio"] + .node-check-label:after {
  box-sizing: border-box;
  content: "";
  border: 1px solid transparent;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  transition: transform var(--transition-duration, ${__transition_duration}) ease-in;
  background-color: transparent;
}
.node-check-input[type="checkbox"] + .node-check-label:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid transparent;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  width: 3px;
  transition: transform var(--transition-duration, ${__transition_duration}) ease-in;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
}
/* 选中状态下的复选框内部样式 */
.node-check-input[type="checkbox"][checked] + .node-check-label:after {
  border-color: #fff;
}
/* 选中状态下的单选框内部样式 */
.node-check-input[type="radio"][checked] + .node-check-label:after {
  border-color: #fff;
  background: #fff;
}
/* 半选中状态下的复选框内部样式 */
.node-check-input:indeterminate[type="checkbox"] + .node-check-label:after,
/* IE 11 */
.node-check-input.indeterminate[type="checkbox"] + .node-check-label:after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  width: 11px;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
  transition: none;
}

/* 禁用状态 */
.node-check-input[disabled] + .node-check-label,
.node-check-input[disabled] + .node-check-label:hover {
  border-color: var(--border-color-base, ${__border_color_base});
  background-color: var(--bg-base, ${__bg_base});
  cursor: not-allowed;
}
.node-check-input[disabled][checked][type="checkbox"] + .node-check-label:after {
  border-color: var(--border-color-base, ${__border_color_base});
}
.node-check-input[disabled][checked][type="radio"] + .node-check-label:after {
  background: var(--border-color-base, ${__border_color_base});
}

/* 结点 label 文本 */
.node-label {
  flex: 1 1 100%;
  padding: 4px 0;
  user-select: none;
}
.node-label .highlight {
  color: var(--color-danger, ${__color_danger});
}

</style>
`

class VirtualNode extends VirtualItem {
  constructor(options) {
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


class BlocksTree extends VList {
  static get observedAttributes() {
    return super.observedAttributes.concat([
      'activable',
      'active-key',
      'checkable',
      'check-strictly',
      'border',
      'default-fold-all',
      'disabled',
      'expand-on-click-node',
      'indent-unit',
      'level-filter',
      'stripe',
    ])
  }

  constructor() {
    super()
    const shadowRoot = this.shadowRoot
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$scrollable = shadowRoot.getElementById('scrollable')
    this.$listSize = shadowRoot.getElementById('list-size')
    this.$list = shadowRoot.getElementById('list')

    this.uniqCid = String(Math.random()).substr(2)

    this.$list.onclick = this._onClick.bind(this)
  }

  // 从数据中提取 label 的方法
  get internalLabelMethod() {
    return typeof this.labelMethod === 'function' ? this.labelMethod
      : typeof this.labelMethod === 'string' ? property(this.labelMethod)
      : property('label')
  }

  get activeKey() {
    return this.getAttribute('active-key')
  }

  set activeKey(value) {
    this.setAttribute('active-key', value)
  }

  get activable() {
    return boolGetter('activable')(this)
  }

  set activable(value) {
    boolSetter('activable')(this, value)
  }

  get disabled() {
    return boolGetter('disabled')(this)
  }

  set disabled(value) {
    boolSetter('disabled')(this, value)
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
    return enumGetter('checkable', [null, 'multiple', 'single'])(this)
  }

  set checkable(value) {
    return enumSetter('checkable', [null, 'multiple', 'single'])(this, value)
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

  itemRender($item, vitem) {
    $item.classList.add('node-item')
    $item.classList.toggle('node-item-active', String(vitem.virtualKey) === this.activeKey)
    $item.style.paddingLeft = this._indent(vitem) + 'px'

    // 折叠箭头
    let $toggle = $item.querySelector('.node-toggle')
    if (!$toggle) {
      $toggle = document.createElement('span')
      $toggle.className = 'node-toggle'
      $item.children.length ? $item.insertBefore($toggle, $item.firstElementChild) : $item.appendChild($toggle)
    }
    if (this.hasChild(vitem)) {
      $toggle.classList.remove('is-leaf')
      $toggle.classList.toggle('folded', !vitem.expanded)
      $toggle.classList.toggle('expanded', !!vitem.expanded)
    }
    else {
      $toggle.classList.remove('folded')
      $toggle.classList.remove('expanded')
      $toggle.classList.add('is-leaf')
    }

    // 选择区
    let $check = $item.querySelector('.node-check')
    if (!this.checkable) {
      if ($check) $item.removeChild($check)
    }
    else {
      let $input
      let $label
      if (!$check) {
        $check = document.createElement('span')
        $check.className = 'node-check'
        if ($item.labelClassMethod && $item.lastElementChild.classList.contains('node-label')) {
          $item.insertBefore($check, $item.lastElementChild)
        }
        else {
          $item.appendChild($check)
        }
        $input = $check.appendChild(document.createElement('input'))
        $input.name = 'node-check-name'
        $input.className = 'node-check-input'
        $label = $check.appendChild(document.createElement('label'))
        $label.classList.add('node-check-label')
      }
      else {
        $input = $check.querySelector('input')
        $label = $check.querySelector('label')
      }

      $input.id = `node-check-${vitem.virtualKey}-${this.uniqCid}`
      $label.setAttribute('for', $input.id)

      boolSetter('checked')($input, vitem.checked)
      boolSetter('disabled')($input, this.disableCheckMethod?.(vitem.data) ?? false)
      $input.setAttribute('data-tree-node-key', vitem.virtualKey)

      // radio 单选
      if (this.checkable === 'single') {
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

    // 内容文本
    let $label = $item.querySelector('.node-label')
    if (!$label) {
      $label = $item.appendChild(document.createElement('span'))
      $label.classList.add('node-label')
    }
    if (this.labelClassMethod) {
      $label.classList.add(this.labelClassMethod(vitem.data))
    }

    const text = this.internalLabelMethod(vitem.data)
    if (this.highlightText && this.highlightText.length) {
      $label.innerHTML = this.parseHighlight(text, this.highlightText).forEach(textSlice => {
        return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`
      }).join('')
    }
    else {
      $label.innerHTML = text
    }
  }

  disableActiveMethod(data) {
    return false
  }

  disableToggleMethod(data) {
    return false
  }

  disableCheckMethod(data) {
    return false
  }

  /**
   * 将某个条目设置为激活（高亮）状态
   */
  active(virtualKey, options) {
    if (!this.activable) return

    const oldKey = this.activeKey
    const newItem = this.getVirtualItemByKey(virtualKey)
    if (!newItem) return
    this.activeKey = virtualKey
    const $newNode = this.getNodeByVirtualKey(virtualKey)
    this.itemRender($newNode, newItem)

    const oldItem = this.getVirtualItemByKey(oldKey)
    const $oldNode = this.getNodeByVirtualKey(oldKey)
    if ($oldNode) {
      this.itemRender($oldNode, oldItem)
    }

    if (!options || !options.preventEmit) {
      dispatchEvent(this, 'active', { detail: {virtualKey: virtualKey, oldNodeKey: oldKey} } )
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
  clearActive(options) {
    if (this.activeKey) {
      const virtualKey = this.activeKey
      this.activeKey = null
      if (!options || !options.preventEmit) {
        dispatchEvent(this, 'inactive', virtualKey)
      }
    }
  }

  // API，通过 virtualKey 展开结点
  expand(virtualKey) {
    const node = this.getVirtualItemByKey(virtualKey)
    if (node) return this._expand(node)
  }

  // API，通过 virtualKey 折叠结点
  fold(virtualKey) {
    const node = this.getVirtualItemByKey(virtualKey)
    if (node) return this._fold(node)
  }

  // API，通过 virtualKey 切换结点的展开、折叠状态
  toggle(virtualKey) {
    const node = this.getVirtualItemByKey(virtualKey)
    if (!node) return
    if (node.expanded) this._fold(node)
    else this._expand(node)
  }

  // API，全部结点折叠
  foldAll() {
    this.nodes.forEach(node => {
      if (node.children) node.expanded = false
    })
    this._updateFold(this.nodes)
  }

  // API，全部结点展开
  expandAll() {
    this.nodes.forEach(node => {
      if (node.children) node.expanded = true
    })
    this._updateFold(this.nodes)
  }

  /**
   * 切换指定 key 的条目的选中状态
   */
  _toggleCheck(virtualKey, value, options = {}) {
    if (this.checkable == null) return

    const vitem = this.getVirtualItemByKey(virtualKey)
    if (!vitem || vitem.checked === value) return

    // 单选模式
    if (this.checkable === 'single') {
      this._toggleRadio(vitem, options)
      return
    }

    // 多选模式
    this._batchToggleCheck([virtualKey], value, options)
  }

  // 单选模式
  _toggleRadio(vitem, options) {
    if (this.lastChecked) {
      // 点击已选中的单选项，不用处理
      if (this.lastChecked === vitem) return
      this._updateCheck(this.lastChecked, false, options.toggleCheckEvent)
    }
    this._updateCheck(vitem, true, options.toggleCheckEvent)
    this.lastChecked = vitem
  }

  // 多选模式
  // 无需联动的情况
  _batchToggleCheckStrictly(vitems, value, options = {}) {
    const disabled = typeof options.disabled === 'boolean' ? options.disabled : false

    const checked = typeof value === 'boolean' ? value : !vitems.every(vitem => vitem.checked)
    vitems.forEach(vitem => {
      if (disabled || !this.disableCheckMethod(vitem.data)) {
        this._updateCheck(vitem, checked, options.toggleCheckEvent)
      }
    })
  }

  // 需要联动的情况
  // 所有子孙结点，切换为全选或者全不选，但 disabled 的结点除外
  _batchToggleCheckNonStrictly(vitems, value, options = {}) {
    const disabled = typeof options.disabled === 'boolean' ? options.disabled : false

    if (!disabled) {
      vitems = vitems.filter(vitem => !this.disableCheckMethod(vitem.data))
      if (!vitems.length) return
    }

    const descendant = flatten(vitems.map(this._descendant.bind(this)))
    
    // 不处理的结点（disabled）
    const excluded = []
    // 叶子结点
    const leaves = []

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
        }
        else if (isEmpty(vitem.children)) {
          leaves.push(vitem)
        }
      })
    }

    let checked
    // value 无传递（如鼠标点击切换的情况），
    // 本次操作是否 checked 根据 nodes 下所有叶子结点确定，
    // nodes 下无叶子，则 nodes 已经是叶子，以 nodes 确定
    if (value == null) {
      checked = !(leaves.length ? leaves.every(leaf => leaf.checked) : vitems.every(node => node.checked))
    }
    else {
      checked = !!value
    }

    // 只需更新 nodes 下的叶子结点，所有祖先结点，都通过叶子结点往上推断出状态
    // （nodes 也可能是叶子结点，因此也需要一并处理）
    {
      leaves.forEach(vitem => {
        this._updateCheck(vitem, checked, options.toggleCheckEvent)
        this._updateIndeterminate(vitem, false)
      })
      vitems.forEach(vitem => {
        this._updateCheck(vitem, checked, options.toggleCheckEvent)
        this._updateIndeterminate(vitem, false)
      })
    }

    // 从受影响的叶子结点（以及 nodes 自身）往祖先结点方向，更新选中、半选中状态，
    // excluded 排除的结点，由于没有切换，也需要往上刷新，以确保半选正确
    {
      leaves.forEach(vitem => this._updateAncestorFrom(vitem, options.toggleCheckEvent))
      vitems.forEach(vitem => this._updateAncestorFrom(vitem, options.toggleCheckEvent))
      excluded.forEach(vitem => {
        if (vitem.checked !== checked) this._updateAncestorFrom(vitem, options.toggleCheckEvent)
      })
    }
  }

  _batchToggleCheck(virtualKeys, value, options = {}) {
    // 单选模式，没有批量选择功能，直接返回
    if (this.checkable !== 'multiple') return

    const vitems = uniqBy(vitem => vitem.virtualKey, virtualKeys.map(this.getVirtualItemByKey.bind(this)))

    if (!vitems.length) return

    options = merge({}, options, { toggleCheckEvent: {} })

    if (this.checkStrictly) {
      this._batchToggleCheckStrictly(vitems, value, options)
    }
    else {
      this._batchToggleCheckNonStrictly(vitems, value, options)
    }

    if (!options.preventEmit && !isEmpty(options.toggleCheckEvent)) {
      forEach(options.toggleCheckEvent, (virtualKeys, eventName) => {
        dispatchEvent(this, eventName, { detail: { virtualKeys } })
      })
    }
  }

  // 更新指定条目的选中状态（数据 & 视图）
  _updateCheck(vitem, checked, event = {}) {
    if (vitem.checked !== checked) {
      const eventName = checked ? 'check' : 'uncheck'
      if (!event[eventName]) event[eventName] = []
      event[eventName].push(vitem.virtualKey)
    }

    vitem.checked = checked
    const $item = this.getNodeByVirtualKey(vitem.virtualKey)
    if ($item) this.itemRender($item, vitem)
  }

  // 更新指定条目的半选中状态（数据 & 视图）
  _updateIndeterminate(vitem, value) {
    vitem.indeterminate = value
    const item = this.getNodeByVirtualKey(vitem.virtualKey)
    if (item) {
      const input = item.querySelector('input')
      input.indeterminate = value
      input.classList[value ? 'add' : 'remove']('indeterminate')
    }
  }

  // 检查子结点列表的状态
  // [子结点选中状态 0|1|0.5，有无半选中的子结点]
  // 1：全部选中
  // 0：全部没有选中
  // 0.5：部分选中
  _childrenStatus(vitem) {
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
  _updateAncestorFrom(node, event) {
    const ancestor = this._ancestor(node).reverse()

    // 子孙级存在半选，则祖先链条往上全部都是半选
    let hasIndeterminate = false

    while (ancestor.length) {
      const parent = ancestor.pop()
      // 已达根级别
      if (!parent) break

      if (hasIndeterminate) {
        this._updateCheck(parent, false, event)
        this._updateIndeterminate(parent, true)
        continue
      }

      // 根据子结点的选中状态，更新 parent 自身状态
      // 更新父结点的半选中状态
      const [checkedStatus, indeterminate] = this._childrenStatus(parent)
      if (indeterminate) {
        hasIndeterminate = true
        this._updateCheck(parent, false, event)
        this._updateIndeterminate(parent, true)
        continue
      }

      // 所有子结点选中时，父节点也选中
      this._updateCheck(parent, checkedStatus === 1, event)
      // 部分子结点未选中时，父结点半选
      this._updateIndeterminate(parent, checkedStatus === 0.5)
    }
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

  // 展开结点
  _expand(node, preventEmit = false) {
    node.expanded = true
    const listKeys = this._descendant(node)
      .filter(child => this.visible(child))
      .map(child => child.virtualKey)

    if (listKeys.length) {
      this.showByKeys(listKeys)
    }

    if (!preventEmit) {
      dispatchEvent(this, 'expand', node.virtualKey)
    }
  }

  // 折叠结点
 _fold(node, preventEmit = false) {
    node.expanded = false
    const children = this._descendant(node)
    const listKeys = children
      .map(child => child.virtualKey)

    if (listKeys.length) {
      this.hideByKeys(listKeys)
    }

    // 如果折叠的结点，包含当前激活的结点，则取消激活状态
    if (this.activeKey && children.findIndex(child => child.virtualKey === this.activeKey) !== -1) {
      const virtualKey = this.activeKey
      this.activeKey = null

      if (!preventEmit) {
        dispatchEvent(this, 'inactive', virtualKey)
      }
    }

    if (!preventEmit) {
      dispatchEvent(this, 'fold', node.virtualKey)
    }
  }

  /**
   * 获取指定结点的所有后代结点
   */
   _descendant(node) {
    const pickChild = (node, children) => {
      children = children || []
      if (!node.children) return children
      node.children.forEach((child) => {
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
  _ancestor(node) {
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
  _siblings(node) {
    const parent = node.parent
    if (parent) {
      return parent.children ?? []
    }
    // 顶层结点
    return this.nodes.filter(node => !node.parent)
  }



  convertData(data) {
    const virtualItems = []

    let index = 0
    const convert = data => {
      const virtualKey = this.keyMethod?.(data) ?? index++
      const vnode = new VirtualNode({
        virtualKey,
        height: this.defaultItemSize,
        data,
        checked: false,
        expanded: true,
        children: [],
      })
      virtualItems.push(vnode)
      const len = data.children?.length
      if (len) {
        for (let i = 0; i < len; i += 1) {
          const childNode = convert(data.children[i])
          childNode.parent = vnode
          childNode.parentKey = vnode.virtualKey
          vnode.children.push(childNode)
        }
      }
      return vnode
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

  // 获取结点的层级
  level(node) {
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
  isTopLevel(node) {
    return !!node.parent
  }

  /**
   * 检查条目是否拥有子结点
   */
  hasChild(node) {
    return node.children && node.children.length > 0
  }

  /**
   * 检查条目当时是否应该可见
   */
  visible(node) {
    if (node.parent && (!node.parent.expanded || !this.visible(node.parent))) {
      return false
    }
    return true
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
      // 1. 点击切换按钮
      if (el.classList.contains('node-toggle')) {
        nodeItem = el.parentNode
        doToggle = true
        break
      }

      // 2. 点击选择框（label 会间接触发 input 的事件，为了避免重复处理，只处理 input 事件）
      if (el.classList.contains('node-check-input')) {
        nodeItem = el.parentNode.parentNode
        if (el.disabled) {
          // 取消本次操作
          break
        }
        doCheck = true
        break
      }

      // 3. 点击文本区
      if (el.classList.contains('node-label')) {
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

      if (el.classList.contains('node-item')) {
        nodeItem = el
        doActive = true
        break
      }
      el = el.parentNode
    }
    if (!nodeItem) return

    // virtualKey 必定为 string，number 也会被转换成 string（dataset 中）
    const virtualKey = nodeItem.dataset.virtualKey
    if (doToggle) {
      if (!this.disableToggleMethod(this.getVirtualItemByKey(virtualKey).data)) {
        this.toggle(virtualKey)
      }
    }
    if (doCheck) {
      if (!this.disableCheckMethod(this.getVirtualItemByKey(virtualKey).data)) {
        this._toggleCheck(virtualKey)
      }
    }
    if (doActive) {
      if (!this.disableActiveMethod(this.getVirtualItemByKey(virtualKey).data)) {
        this.active(virtualKey)
      }
    }

    dispatchEvent(this, 'click', virtualKey)
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
