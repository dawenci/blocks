import '../scrollable/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { find, findLast, forEach } from '../../common/utils.js'
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
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'

const FORCE_SLICE = true

const Direction = {
  Vertical: 'vertical',
  Horizontal: 'horizontal'
}

const normalizeSize = (input, defaults = '100%') => {
  if (typeof input === 'number') {
    return Math.round(input) + 'px'
  }
  if (typeof input === 'string') return input
  return defaults
}

const ITEMS_SIZE_UPDATE = 'items-size-change'
const DATA_VIEW_CHANGE = 'data-view-change'
const VIEWPORT_MAIN_CHANGE = 'viewport-main-change'
const VIEWPORT_CROSS_CHANGE = 'viewport-cross-change'
const CANVAS_MAIN_CHANGE = 'canvas-main-change'
const CANVAS_CROSS_CHANGE = 'canvas-cross-change'
const TOGGLE_MAIN_SCROLLBAR = 'toggle-main-scrollbar'
const TOGGLE_CROSS_SCROLLBAR = 'toggle-cross-scrollbar'
const WRAPPED_DATA_CHANGE = 'wrapped-data-change'
const SLICE = 'slice'
const SCROLL = 'scroll'

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
  height: 100%;
}
#list {
  display: flex;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}
:host(:not([direction="horizontal"])) #list {
  flex-flow: column nowrap;
  width: 100%;
}
:host([direction="horizontal"]) #list {
  flex-flow: row nowrap;
  height: 100%;
}

#list > div {
  flex: 0 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
:host(:not([direction="horizontal"])) > div {
  width: 100%;
  height: auto;
}
:host([direction="horizontal"]) > div {
  width: auto;
  height: 100%;
}

.collapse-enter-transition-active,
.collapse-leave-transition-active {
  display: block;
  overflow: hidden;
  transition-delay: 0, 0;
  transition-property: opacity, height;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}
.collapse-enter-transition-from,
.collapse-leave-transition-to {
  opacity: 1;
  /* height 使用 js 设置 */
}
.collapse-enter-transition-to,
.collapse-leave-transition-from {
  opacity: 0;
  height: 0 !important;
}


/*.item:hover {
  background-color: ${rgbaFromHex(__color_primary, .1)};
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
*/
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

class VItem {
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

  clone() {
    const options = {}
    Object.keys(this).forEach((key) => {
      options[key] = this[key]
    })
    return new VItem(options)
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
    definePrivate(this, '_selected', [])
    // 所有条目（包括筛选条件之外的完整数据）
    definePrivate(this, 'virtualItems', [])
    // 视图条目（筛选、排序后的所有条目）
    definePrivate(this, 'virtualViewItems', [])
    // 切片条目（局部渲染的条目）
    definePrivate(this, 'virtualSliceItems', [])
    // 视图条目对应的条目高度存储
    definePrivate(this, 'itemHeightStore', null)

    // 数据 key --> VItem 的映射，提高访问性能
    this.keyDataMap = Object.create(null)

    this.$scrollable.onscroll = this._updateSliceRange.bind(this, undefined)
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

  get direction() {
    return enumGetter('direction', [Direction.Vertical, Direction.Horizontal], Direction.Vertical)(this)
  }

  set direction(value) {
    enumSetter('direction', [null, Direction.Vertical, Direction.Horizontal])(this, value)
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

  get isFixedItemSize() {
    return boolGetter('is-fixed-item-size')(this)
  }

  set isFixedItemSize(value) {
    boolSetter('is-fixed-item-size')(this, value)
  }

  // 层级过滤器，0 代表不过滤，其他数值代表需要显示到哪一级的数据
  get levelFilter() {
    return intGetter('level-filter', 0)(this)
  }

  set levelFilter(value) {
    intSetter('level-filter')(this, value)
  }

  get $viewport() {
    return this.$scrollable
  }

  get viewportWidth() {
    return this.$viewport.clientWidth
  }

  get viewportHeight() {
    return this.$viewport.clientHeight
  }

  // 视口主轴方向尺寸
  get viewportMainSize() {
    return this.direction === Direction.Vertical ? this.viewportHeight : this.viewportWidth
  }

  // 视口侧轴方向尺寸
  get viewportCrossSize() {
    return this.direction === Direction.Vertical ? this.viewportWidth : this.viewportHeight
  }

  // 内容容器主轴方向尺寸
  get canvasMainSize() {
    return itemHeightStore.read(itemHeightStore.maxVal)
  }

  // 内容容器侧轴方向尺寸
  get canvasCrossSize() {
    return this.viewportCrossSize
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    upgradeProperty(this, 'data')

    this._updateSliceRange()
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
      const node = new VItem({
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

    this.rebuildViewData()
  }

  /**
   * 从组件数据中提取子集作为当前过滤、排序条件下的数据
   * 依赖：virtualItems, filterMethod, sortMethod, defaultItemSize
   */
  rebuildViewData() {
    const { virtualItems, filterMethod, sortMethod } = this
    let data = []

    // 过滤
    if (typeof filterMethod === 'function') {
      for (let index = 0, len = virtualItems.length; index < len; index += 1) {
        if (filterMethod(virtualItems[index].data)) {
          data.push(virtualItems[index])
        }
      }
    }

    // 无过滤
    else {
      data = virtualItems.slice()
    }

    // 排序
    if (typeof sortMethod === 'function') data.sort(sortMethod)

    // 重新记录数据在视图中的位置，用于隐藏部分条目时，可以精确计算高度、坐标
    let i = virtualItems.length
    while (i--) virtualItems[i].viewIndex = -1
    i = data.length
    while (i--) data[i].viewIndex = i

    // 重建高度存储
    this.itemHeightStore = new BinaryIndexedTree({ defaultFrequency: this.defaultItemSize, maxVal: data.length })

    // 从缓存中快速恢复已计算出高度的条目的高度
    for (let index = 0, size = data.length; index < size; index += 1) {
      const node = data[index]
      // 小于零的需要隐藏，所以高度为 0
      this.itemHeightStore.writeSingle(index, (1 / node.height > 0) ? node.height : 0)
    }

    this.virtualViewItems = data

    // 刷新列表高度
    this._updateListSize()

    // 重置滚动位置
    // const viewport = this.$refs.viewport
    // if (viewport) {
    //   this.setScrollMain(0)
    //   this.anchorIndex = 0
    //   this.anchorOffsetRatio = 0
    // }

    // 重新切片当前 viewport 需要的数据
    this._updateSliceRange(FORCE_SLICE)

    dispatchEvent(this, DATA_VIEW_CHANGE, this._pluckData(this.virtualViewItems))
  }

  _updateSliceRange(forceUpdate) {
    const viewportSize = this.direction === Direction.Horizontal ? this.$scrollable.clientWidth : this.$scrollable.clientHeight
    const viewportStart = this.direction === Direction.Horizontal ? this.$scrollable.scrollLeft : this.$scrollable.scrollTop

    // 计算出准确的切片区间
    const range = this._calcSliceRange(viewportSize, viewportStart)
    if (range.sliceFrom === this.sliceFrom && range.sliceTo === this.sliceTo && !forceUpdate) {
      return
    }

    this.anchorIndex = range.sliceFrom
    this.anchorOffsetRatio = range.anchorOffsetRatio

    // 上下方额外多渲染的条目波动量
    const COUNT = this._preRenderingCount(viewportSize)

    // 预渲染触发阈值
    const THRESHOLD = this._preRenderingThreshold(viewportSize)

    // 数据总量
    const MAX = this.virtualViewItems.length

    // 检查计算出来的切片范围，是否被当前已经渲染的切片返回包含了
    // 如果是，无需更新切片，（如果 forceUpdate，则无论如何都需要重新切片）
    let fromThreshold = range.sliceFrom - THRESHOLD
    if (fromThreshold < 0) fromThreshold = 0
    let toThreshold = range.sliceTo + THRESHOLD
    if (toThreshold > MAX) toThreshold = MAX

    // 无需强制刷新，且上下两端都没有触达阈值时，无需重新切片
    if (!forceUpdate && ((this.sliceFrom <= fromThreshold) && (this.sliceTo >= toThreshold))) {
      // console.log('无需切片', `O(${this.sliceFrom},${this.sliceTo}), N(${fromThreshold},${toThreshold})`)
      return
    }

    // 更新切片的情况
    // console.log('需切片', `O(${this.sliceFrom},${this.sliceTo}), N(${fromThreshold},${toThreshold})`)

    // 在切片区间头部、尾部，追加预渲染的条目
    let { sliceFrom, sliceTo } = range
    sliceFrom = sliceFrom > COUNT ? sliceFrom - COUNT : 0
    sliceTo = sliceTo + COUNT > MAX ? MAX : sliceTo + COUNT

    const shouldDoSlice = this.forceUpdate || this.sliceFrom !== sliceFrom || this.sliceTo !== sliceTo

    this.sliceFrom = sliceFrom
    this.sliceTo = sliceTo
    
    if (shouldDoSlice) {
      this._doSlice(sliceFrom, sliceTo)
    }
  }

  // 计算局部渲染数据切片的起止点
  _calcSliceRange(viewportSize, viewportStart) {
    if (!this.virtualViewItems.length) {
      return { sliceFrom: 0, sliceTo: 0, anchorOffsetRatio: 0 }
    }

    const MIN_INDEX = 0
    const MAX_INDEX = this.virtualViewItems.length - 1

    // 视口下边界
    const viewportEnd = viewportStart + viewportSize
    // 预估条目高度
    const estimatedItemSize = this.defaultItemSize

    // 2 分估算的最大范围
    let min = MIN_INDEX
    let max = MAX_INDEX
    let itemTop
    let itemOffset
    let itemHeight
    let itemBottom

    // 锚定元素的偏移比例
    let anchorOffsetRatio

    let loopTime = 10000

    // 从估算值开始计算起始序号
    let sliceFrom = Math.floor(viewportStart / estimatedItemSize)
    if (sliceFrom > MAX_INDEX) sliceFrom = MAX_INDEX
    while (sliceFrom >= MIN_INDEX && sliceFrom <= MAX_INDEX) {
      if (!loopTime--) {
        console.warn('可能存在死循环')
        break
      }

      itemTop = this._itemOffset(sliceFrom)
      itemHeight = this._itemSize(sliceFrom)

      // 条目顶部相对于 viewport 顶部的偏移
      itemOffset = itemTop - viewportStart
      anchorOffsetRatio = itemOffset / itemHeight

      // 1. 该条目距离视口顶部有距离，说明上方还有条目元素需要显示，继续测试上一条
      if (itemOffset > 0) {
        max = Math.min(sliceFrom, max)
        // 二分法快速估算下一个尝试位置
        // offset / 平均高度，即预估的条目数量差距
        // TODO, 对于固定高度，简化
        const diff1 = itemOffset / ((itemTop + estimatedItemSize) / (sliceFrom + 1))
        // 预估的条目差距取 2 分之一，跟 (max - min) / 2 比较，取小的为准
        const halfDiff1 = Math.ceil(Math.min(diff1 / 2, (max - min) / 2))
        sliceFrom -= halfDiff1
        if (sliceFrom < MIN_INDEX) sliceFrom = MIN_INDEX
        continue
      }

      // 2. 恰好显示该条目的顶部，则该条目为本次视口的首条元素
      if (itemOffset === 0) break

      // 以下都是 itemOffset < 0

      // 3. 该条目在顶部露出了一部分，则该条目为本次视口的首条元素
      if (-itemOffset < itemHeight) break

      // 4. 该条目已被滚出去视口，继续测试下一条
      // 二分法快速估算下一个尝试位置
      {
        min = Math.max(sliceFrom, min)
        const diff2 = -itemOffset / ((itemTop + estimatedItemSize) / (sliceFrom + 1))
        const halfDiff2 = Math.ceil(Math.min(diff2 / 2, (max - min) / 2))
        sliceFrom += halfDiff2
        if (sliceFrom > MAX_INDEX) sliceFrom = MAX_INDEX
      }
    }

    loopTime = 10000

    // 从估算值开始计算结束序号
    min = MIN_INDEX
    max = MAX_INDEX
    let sliceTo = sliceFrom + Math.floor(viewportSize / estimatedItemSize)
    if (sliceTo > MAX_INDEX) sliceTo = MAX_INDEX
    while (sliceTo > MIN_INDEX && sliceTo <= MAX_INDEX) {
      if (!loopTime--) {
        console.warn('可能存在死循环')
        break
      }

      itemTop = this._itemOffset(sliceTo)
      itemHeight = this._itemSize(sliceTo)
      itemBottom = itemTop + itemHeight
      // 条目底部相对于 viewport 底部的偏移
      itemOffset = itemBottom - viewportEnd

      // 1. 该条目的底部距离视口底部有距离，说明下方还有条目元素需要显示，继续测试下一条
      if (itemOffset < 0) {
        min = Math.max(sliceTo, min)
        const diff3 = -itemOffset / ((itemTop + estimatedItemSize) / (sliceTo + 1))
        const halfDiff3 = Math.ceil(Math.min(diff3 / 2, (max - min) / 2))
        sliceTo += halfDiff3

        // 最后一条，都无法填充满视口（比如隐藏）
        if (sliceTo >= MAX_INDEX) {
          break
        }
        continue
      }

      // 2. 恰好显示该条目的底部，则该条目为视口中最后一项
      if (itemOffset === 0) break

      // 3. 该条目在底部被裁剪了一部分，则该条目为本次视口的末项
      if (itemOffset < itemHeight) break

      // 该条目还未出场，继续测试上一条
      // 二分法快速估算下一个尝试位置
      {
        max = Math.min(sliceTo, max)
        const diff4 = itemOffset / ((itemTop + estimatedItemSize) / (sliceTo + 1))
        const halfDiff4 = Math.ceil(Math.min(diff4 / 2, (max - min) / 2))
        sliceTo -= halfDiff4
        if (sliceTo < sliceFrom) sliceTo = sliceFrom
      }
    }

    // 执行 slice 的时候，不含 end，所以 + 1
    sliceTo += 1

    return { sliceFrom, sliceTo, anchorOffsetRatio }
  }

  // 上下两端预先批量渲染的项目波动量
  // 原理是，每次插入删除都是一个小批量动作，
  // 而不是每次只插入一条、销毁一条
  // 计算出的局部渲染数据范围，跟上一次计算出来的结果，差距
  // 在这个波动量范围内，则不重新切片渲染，用于
  // 防止频繁插入内容导致性能压力
  _preRenderingCount(viewportSize) {
    // return 0
    // 默认预渲染 1 屏
    const len = this.virtualSliceItems.length
    const defaults = Math.ceil(viewportSize / this.defaultItemSize)
    return len ? Math.min(len, defaults) : defaults
  }

  // 滚动到上下方剩下多少个条目时，加载下一批
  // 防止 iOS 快速触摸滚动时的白屏
  _preRenderingThreshold(viewportSize) {
    // return 0
    // 默认触达预渲染的一半数量时，加载下一批切片
    return Math.floor(this._preRenderingCount(viewportSize) / 2)
  }

  _doSlice(fromIndex, toIndex) {
    const virtualViewItems = this.virtualViewItems
    const slice = []

    for (let i = fromIndex; i < toIndex; i += 1) {
      const wrappedItem = virtualViewItems[i]
      if (wrappedItem.height > 0) slice.push(wrappedItem)
    }

    const oldSlice = this.virtualSliceItems.slice()
    this.virtualSliceItems = Object.freeze(slice)

    dispatchEvent(this, SLICE, this._pluckData(slice), this._pluckData(oldSlice))

    this.render()
  }

  // 当前渲染出来的条目元素
  _viewingItems() {
    const result = []
    const children = this.$list.children
    for (let i = 0, len = children.length; i < len; i += 1) {
      result.push(children[i])
    }
    return result
  }  

  // 根据当前屏幕上的条目，更新尺寸
  _updateSizeByItems(nodeItems) {
    if (!nodeItems?.length) return

    const batch = []
    nodeItems.forEach((node) => {
      const wrappedItem = this._getDataByNode(node)

      // wrappedItem 在复杂的情况下，可能出现 undefined
      if (!wrappedItem) return

      // 获取高度
      const height = this.itemSizeMethod(node, {
        key: wrappedItem.key,
        height: wrappedItem.height,
        calculated: wrappedItem.calculated,
        viewIndex: wrappedItem.viewIndex,
        direction: this.direction,
      }) >> 0

      // 可能组件隐藏中
      if (height === 0) return

      // 计算出来的高度跟旧高度或默认值一致，
      // 则无需更新，但是设置已经计算状态
      // 以便下次可以直接使用缓存
      if (wrappedItem.height === height) {
        wrappedItem.calculated = true
      }

      // 高度不一致，则设置标识，需要在批处理中进行刷新
      else {
        batch.push({ wrappedItem, height, calculated: true })
      }
    })

    if (batch.length) {
      this._batchUpdateHeight(batch)
    }
  }  

  // Dom 插入时候，计算高度，然后
  // 批量刷新高度，避免频繁调整列表高度带来性能问题
  _batchUpdateHeight(records) {
    const changes = records
      .map(({ wrappedItem, height, calculated }) => {
        const hasChange = this._updateSize(wrappedItem, height, calculated)
        return hasChange ? { key: wrappedItem.key, value: height } : null
      })
      .filter(item => !!item)

    if (changes.length) {
      this._updateListSize()
      this._updateSliceRange(true)

      dispatchEvent(this, ITEMS_SIZE_UPDATE, changes)
    }
  }

  // 刷新列表项高度
  _updateSize(wrappedItem, height, calculated) {
    height = height >> 0

    const hasChange = height !== wrappedItem.height

    // 更新结点高度缓存
    wrappedItem.height = height

    if (calculated != null) {
      wrappedItem.calculated = calculated
    }

    // 如果 wrappedItem 为当前过滤下的项目，
    // 则同时刷新高度存储 store
    const index = wrappedItem.viewIndex
    if (index !== -1) {
      // 小于等于零表示折叠不显示，计算高度为零
      // 负值存在 wrappedItem 中，用于反折叠时恢复
      this.itemHeightStore.writeSingle(index, height > 0 ? height : 0)
    }

    return hasChange
  }  

  // 通过 DOM Node 获取对应的数据
  _getDataByNode($node) {
    return this.keyDataMap[$node.vlistItemKey]
  }

  itemSizeMethod($node, options) {
    return options.calculated
      ? options.height
      : options.direction === Direction.Horizontal
        ? $node.offsetWidth
        : $node.offsetHeight
  }

  internalItemRender($item, vitem) {
    const render = this.itemRender ?? (($item) => {
      const label = vitem.data[this.labelField] ?? ''
      const isDisabled = vitem.data[this.disabledField] ?? false
      $item.children[1].innerHTML = label
    })
    render($item)
  }

  render() {
    this._updateListSize()
    const renderCount = this.sliceTo - this.sliceFrom

    // 列表中，存在多少个动画元素
    const transitionItemCount = this.$list.querySelectorAll('.transition').length

    if (this.direction === Direction.Horizontal) {
      this.$list.style.transform = `translateX(${this._itemOffset(this.sliceFrom)}px)`
    }
    else {
      this.$list.style.transform = `translateY(${this._itemOffset(this.sliceFrom)}px)`
    }
    
    const sliceItems = this.virtualSliceItems
    const idIndexMap = {}
    sliceItems.forEach((node, i) => idIndexMap[node.key] = i)

    const getFirst = () => transitionItemCount ? find(this.$list.children, $item => $item.viewIndex != null) : this.$list.firstElementChild
    const getLast = () => transitionItemCount ? findLast(this.$list.children, $item => $item.viewIndex != null) : this.$list.lastElementChild

    // 渲染条目 DOM，针对滚动的场景做优化
    const startKey = sliceItems[0].viewIndex
    const endKey = sliceItems[sliceItems.length - 1].viewIndex
    const startItemKey = getFirst()?.viewIndex
    const endItemKey = getLast()?.viewIndex

    // 上滚
    if (endKey < endItemKey || (endKey === endItemKey && startKey < startItemKey)) {
      // 结尾对齐
      let $last
      while (this.$list.children.length && ($last = getLast())?.viewIndex !== endKey) {
        $last && this._$pool.push(this.$list.removeChild($last))
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this._$pool.push(this.$list.removeChild(this.$list.firstElementChild))
      }
      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.insertBefore(this._$pool.pop() ?? itemTemplate.content.querySelector('.item').cloneNode(true), this.$list.firstElementChild)
      }
    }
    else {
      // 下滚
      if (startKey > startItemKey || (startKey === startItemKey && endKey > endItemKey)) {
        // 开头对齐
        let $first
        while(this.$list.children.length && ($first = getFirst())?.viewIndex !== startKey) {
          $first && this._$pool.push(this.$list.removeChild($first))
        }
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this._$pool.push(this.$list.removeChild(this.$list.lastElementChild))
      }
      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.appendChild(this._$pool.pop() ?? itemTemplate.content.querySelector('.item').cloneNode(true))
      }
    }
    this._$pool = []

    // 渲染条目内部内容
    let i = -1
    let j = -1
    while (++i < renderCount) {
      const $item = this.$list.children[i]
      if ($item.classList.contains('transition')) continue
      const vitem = sliceItems[++j]

      if (!vitem) return
      $item.key = $item.dataset.id = vitem.key
      $item.viewIndex = vitem.viewIndex
      this.internalItemRender($item, vitem)
    }

    // 非固定高度场景，提取界面元素高度，刷新高度存储
    if (!this.isFixedItemSize) {
      // 过滤出未计算过高度的条目
      const viewItems = this._viewingItems()
      this._updateSizeByItems(viewItems)
    }
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


  // TODO
  // 滚动到锚定位置，仅在高度都已经计算后才生效，否则滚动到目的地，
  // 高度经过计算发生变化的话，无法对准
  _scrollToAnchor(anchorIndex, anchorOffsetRatio) {
    if (anchorIndex < this.virtualViewItems.length) {
      const start = this._itemOffset(anchorIndex)
      const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio)
      let scroll = start - offset
      if (scroll < 0) scroll = 0
      if (scroll > this.canvasMainSize - this.viewportMainSize) scroll = this.canvasMainSize - this.viewportMainSize
      this.setScrollMain(scroll)
    }
  }

  // 提前结束动画
  async _clearTransition() {
    let flag = false
    forEach(this.$list.querySelectorAll('.transition'), $transition => {
      flag = true
      $transition.className = 'transition'
    })
    if (!flag) return Promise.resolve(flag)
    return new Promise(resolve => setTimeout(() => resolve(flag), 50))
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
  async showByKeys(keys) {
    const changes = keys.map((key) => this.keyDataMap[key])
      .filter((wrappedItem) => wrappedItem?.height <= 0)
      .map((wrappedItem) => {
        const height = (-wrappedItem.height || this.defaultItemSize)
        const hasChange = this._updateSize(wrappedItem, height)
        return hasChange ? { key: wrappedItem.key, value: height } : null
      })
      .filter(item => !!item)

    this._refreshList()

    // 如果存在未结束的动画，提前结束
    if (await this._clearTransition()) {
      this._refreshList()
    }

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')
    let firstFlag = false
    forEach(this.$list.children, $item => {
      if (keys.includes($item.key)) {
        if (!firstFlag) {
          this.$list.insertBefore($collapse, $item)
          firstFlag = true
        }
        $collapse.appendChild($item)
      }
    })
    if ($collapse.children.length) {
      const size = Array.prototype.reduce.call($collapse.children, (acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0)
      $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`
      doTransitionLeave($collapse, 'collapse', () => {
        console.log('show')
        forEach($collapse.children, $item => {
          this.$list.insertBefore($item, $collapse)
        })
        this.$list.removeChild($collapse)
        this._nextTick(() => this._refreshList())
      })
    }

    if (changes.length) dispatchEvent(this, ITEMS_SIZE_UPDATE, changes)
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
   async hideByKeys(keys) {
    const changes = keys.map((key) => this.keyDataMap[key])
      .filter(wrappedItem => wrappedItem?.height > 0)
      .map((wrappedItem) => {
        // 设置为负数，表示隐藏
        const height = -wrappedItem.height
        wrappedItem.height = height
        const hasChange = this._updateSize(wrappedItem, height)
        return hasChange ? { key: wrappedItem.key, value: height } : null
      })
      .filter(item => !!item)

    // 如果存在未结束的动画，提前结束
    if (await this._clearTransition()) {
      this._refreshList()
    }

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')
    let firstFlag = false
    forEach(this.$list.children, $item => {
      if (keys.includes($item.key)) {
        if (!firstFlag) {
          this.$list.insertBefore($collapse, $item)
          firstFlag = true
        }
        $collapse.appendChild($item)
      }
    })
    if ($collapse.children.length) {
      const size = Array.prototype.reduce.call($collapse.children, (acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0)
      $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`
      doTransitionEnter($collapse, 'collapse', () => {
        console.log('hide')
        this.$list.removeChild($collapse)
        this._refreshList()
      })
    }

    this._nextTick(() => this._refreshList())
    if (changes.length) dispatchEvent(this, ITEMS_SIZE_UPDATE, changes)
  }  

  // 刷新列表高度、重新切片渲染
  _refreshList() {
    this._updateListSize()
    this._updateSliceRange(FORCE_SLICE)
  }

  _nextTick(callback) {
    return Promise.resolve().then(callback)
  }
}

if (!customElements.get('bl-tree')) {
  customElements.define('bl-tree', BlocksTree)
}
