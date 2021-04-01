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
} from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import BinaryIndexedTree from '../../common/BinaryIndexedTree.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'

const FORCE_SLICE = true

const Direction = {
  Vertical: 'vertical',
  Horizontal: 'horizontal'
}

const ITEMS_SIZE_UPDATE = 'items-size-change'
const DATA_VIEW_CHANGE = 'data-view-change'
const DATA_CHANGE = 'data-change'
const SLICE_CHANGE = 'slice-change'

const template = document.createElement('template')
template.innerHTML = `
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
  box-sizing: border-box;
  position: relative;
  cursor: default;
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
  opacity: 1 !important;
  /* height 使用 js 设置 */
}
.collapse-enter-transition-to,
.collapse-leave-transition-from {
  opacity: 0 !important;
  height: 0 !important;
}
</style>

<bl-scrollable id="scrollable">
  <div id="list-size"></div>
  <div id="list"></div>
</bl-scrollable>
`

const itemTemplate = document.createElement('div')

// 列表项数据包裹，data 字段存放原始数据
// 组件所有操作不应该改变 data 的内容，而是修改该包裹对象的属性
export class VirtualItem {
  constructor(options = {}) {
    // 数据的唯一id，对应 keyMethod 的值，如果没有
    // 配置 keyMethod 则是初始化数据时候的序号
    // 每次传入的 data 改变，都会重新生成
    this.virtualKey = options.virtualKey
    // 条目高度
    // 1. 正数代表已经计算出来的高度
    // 2. 0 代表未计算的高度，不显示
    // 3. 负数代表需要隐藏的高度，隐藏前已计算出来的高度为其绝对值，方便取消隐藏
    // 用途：
    // 1. 用于重建高度存储时快速恢复
    // 2. 用于快速通过数据取高度
    this.height = options.height >> 0
    // 记录是否已经根据实际 DOM 计算过高度
    this.calculated = !!options.calculated
    // 条目在当前过滤视图中的序号
    // 每次生成视图数据都刷新
    this.virtualViewIndex = options.virtualViewIndex ?? -1
    // 原始数据的引用
    this.data = options.data
  }

  clone() {
    const options = {}
    Object.keys(this).forEach((key) => {
      options[key] = this[key]
    })
    return new VirtualItem(options)
  }
}

export default class BlocksVList extends HTMLElement {
  static get observedAttributes() {
    return ['direction', 'default-item-size', 'label-field', 'shadow']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$viewport = shadowRoot.getElementById('scrollable')
    this.$listSize = shadowRoot.getElementById('list-size')
    this.$list = shadowRoot.getElementById('list')

    definePrivate(this, '_dataBound', false)
    definePrivate(this, '_$pool', [])
    definePrivate(this, '_data', [])
    // 所有条目（包括筛选条件之外的完整数据）
    definePrivate(this, 'virtualItems', [])
    // 视图条目（筛选、排序后的所有条目）
    definePrivate(this, 'virtualViewItems', [])
    // 切片条目（局部渲染的条目）
    definePrivate(this, 'virtualSliceItems', [])
    // 视图条目对应的条目高度存储
    definePrivate(this, 'itemHeightStore', null)

    // 数据 key --> VItem 的映射，提高访问性能
    definePrivate(this, 'virtualItemMap', null)

    this.$viewport.onscroll = this._updateSliceRange.bind(this, undefined)
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

  get labelField() {
    return this.getAttribute('label-field') || 'label'
  }

  set labelField(value) {
    this.setAttribute('label-field', value)
  }

  get defaultItemSize() {
    return intGetter('default-item-size', parseInt(getComputedStyle(this).getPropertyValue('--item-height'), 10))(this)
  }

  set defaultItemSize(value) {
    return intSetter('default-item-size')(this, value)
  }

  get shadow() {
    return boolGetter('shadow')(this)
  }

  set shadow(value) {
    boolSetter('shadow')(this, value)
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
    return this.itemHeightStore.read(this.itemHeightStore.maxVal)
  }

  // 内容容器侧轴方向尺寸
  get canvasCrossSize() {
    return this.viewportCrossSize
  }

  connectedCallback() {
    if (!this._dataBound) {
      this.constructor.observedAttributes.forEach(attr => {
        upgradeProperty(this, attr)
      })
      upgradeProperty(this, 'data')
    }
  }

  disconnectedCallback() {}

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (BlocksVList.observedAttributes.includes(attrName)) {
      this.redraw()
    }
    if (attrName === 'shadow') {
      this.$viewport.shadow = this.shadow
    }
  }

  itemRender($item, vitem) {
    const label = vitem.data[this.labelField] ?? ''
    $item.innerHTML = label
  }

  itemSizeMethod($node, options) {
    return options.calculated
      ? options.height
      : options.direction === Direction.Horizontal
        ? $node.offsetWidth
        : $node.offsetHeight
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
  async showByKeys(keys) {
    // 如果存在未结束的动画，提前结束
    await this._clearTransition()
    
    const changes = keys.map((key) => this.virtualItemMap[key])
      .filter((wrappedItem) => wrappedItem?.height <= 0)
      .map((wrappedItem) => {
        const height = (-wrappedItem.height || this.defaultItemSize)
        const hasChange = this._updateSize(wrappedItem, height)
        return hasChange ? { key: wrappedItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    // 刷新列表
    this._updateSliceRange(FORCE_SLICE)

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')
    const items = []
    let $first
    forEach(this.$list.children, $item => {
      if (keys.includes($item.virtualKey)) {
        if (!$first) $first = $item
        items.push($item)
      }
    })
    const size = items.reduce((acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0)
    this.$list.insertBefore($collapse, $first)
    items.reverse()
    while (items.length) {
      $collapse.appendChild(items.pop())
    }
    if ($collapse.children.length) {
      $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`
      doTransitionLeave($collapse, 'collapse', () => {
        Array.prototype.slice.call($collapse.children).forEach($item => {
          this.$list.insertBefore($item, $collapse)
        })
        this.$list.removeChild($collapse)
        this.nextTick(() => this.redraw())
      })
    }

    if (changes.length) dispatchEvent(this, ITEMS_SIZE_UPDATE, changes)
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
   async hideByKeys(keys) {
    // 如果存在未结束的动画，提前结束
    await this._clearTransition()

    const changes = keys.map((key) => this.virtualItemMap[key])
      .filter(wrappedItem => wrappedItem?.height > 0)
      .map((wrappedItem) => {
        // 设置为负数，表示隐藏
        const height = -wrappedItem.height
        wrappedItem.height = height
        const hasChange = this._updateSize(wrappedItem, height)
        return hasChange ? { key: wrappedItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')
    const items = []
    let $first
    forEach(this.$list.children, $item => {
      if (keys.includes($item.virtualKey)) {
        if (!$first) $first = $item
        items.push($item)
      }
    })
    const size = items.reduce((acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0)
    this.$list.insertBefore($collapse, $first)
    items.reverse()
    while (items.length) {
      $collapse.appendChild(items.pop())
    }
    if ($collapse.children.length) {
      $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`
      doTransitionEnter($collapse, 'collapse', () => {
        this.$list.removeChild($collapse)
        this.redraw()
      })
    }

    this.nextTick(() => this.redraw())
    if (changes.length) dispatchEvent(this, ITEMS_SIZE_UPDATE, changes)
  }

  nextTick(callback) {
    return Promise.resolve().then(callback)
  }

  render() {
    if (!this._dataBound) {
      return this.rebuildViewData()
    }

    this._updateListSize()
    const renderCount = this.virtualSliceItems.length

    // 列表中，存在多少个动画元素
    const transitionItemCount = this.$list.querySelectorAll('.transition').length

    if (this.direction === Direction.Horizontal) {
      this.$list.style.transform = `translateX(${this._itemOffset(this.sliceFrom)}px)`
    }
    else {
      this.$list.style.transform = `translateY(${this._itemOffset(this.sliceFrom)}px)`
    }

    const sliceItems = this.virtualSliceItems
    const getFirst = () => transitionItemCount ? find(this.$list.children, $item => $item.virtualViewIndex != null) : this.$list.firstElementChild
    const getLast = () => transitionItemCount ? findLast(this.$list.children, $item => $item.virtualViewIndex != null) : this.$list.lastElementChild

    // 渲染条目 DOM，针对滚动的场景做优化
    const startKey = sliceItems[0].virtualViewIndex
    const endKey = sliceItems[sliceItems.length - 1].virtualViewIndex
    const startItemKey = getFirst()?.virtualViewIndex
    const endItemKey = getLast()?.virtualViewIndex

    // 上滚
    if (endKey < endItemKey || (endKey === endItemKey && startKey < startItemKey)) {
      // 结尾对齐
      let $last
      while (this.$list.children.length && ($last = getLast())?.virtualViewIndex !== endKey) {
        $last && this._$pool.push(this.$list.removeChild($last))
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this._$pool.push(this.$list.removeChild(this.$list.firstElementChild))
      }
      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.insertBefore(this._$pool.pop() ?? itemTemplate.cloneNode(true), this.$list.firstElementChild)
      }
    }
    else {
      // 下滚
      if (startKey > startItemKey || (startKey === startItemKey && endKey > endItemKey)) {
        // 开头对齐
        let $first
        while(this.$list.children.length && ($first = getFirst())?.virtualViewIndex !== startKey) {
          $first && this._$pool.push(this.$list.removeChild($first))
        }
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this._$pool.push(this.$list.removeChild(this.$list.lastElementChild))
      }
      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.appendChild(this._$pool.pop() ?? itemTemplate.cloneNode(true))
      }
    }
    this._$pool = []

    // 渲染条目内部内容
    let i = -1
    let j = -1
    while (++i < this.$list.children.length) {
      const $item = this.$list.children[i]
      if ($item.classList.contains('transition')) continue
      const vitem = sliceItems[++j]

      if (!vitem) return
      $item.virtualKey = $item.dataset.virtualKey = vitem.virtualKey
      $item.virtualViewIndex = vitem.virtualViewIndex
      this.itemRender($item, vitem)
    }

    // 过滤出未计算过高度的条目
    this._updateSizeByItems(this.$list.children)
  }

  // 刷新列表高度、重新切片渲染
  redraw() {
    this._updateListSize()
    this._updateSliceRange(FORCE_SLICE)
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
    }
    data.forEach(convert)
    return virtualItems
  }

  /**
   * 包裹一份数据列表作为组件数据，依赖：传入注入数据
   */
  setData(data) {
    if (this._dataBound && data === this._data) {
      return
    }

    const virtualItems = this.convertData(data)

    // 构建 virtualItemMap，形成 key-data 映射，方便后续快速查找数据
    const virtualItemMap = Object.create(null)
    let i = virtualItems.length
    while (i--) {
      virtualItemMap[virtualItems[i].virtualKey] = virtualItems[i]
    }

    // 如果存在旧数据，并且配置了自定义 key 字段，
    // 则尝试从旧数据中恢复信息
    const oldKeyDataMap = this.virtualItemMap
    if (oldKeyDataMap && this.keyMethod) {
      let i = virtualItems.length
      while (i--) {
        const wrappedItem = virtualItems[i]
        const oldWrappedItem = oldKeyDataMap[wrappedItem.virtualKey]
        if (oldWrappedItem) {
          wrappedItem.height = oldWrappedItem.height
        }
      }
    }

    this.virtualItems = virtualItems
    this.virtualItemMap = virtualItemMap

    this._dataBound = true

    // 完成后，抛出事件
    dispatchEvent(this, DATA_CHANGE, virtualItems, virtualItemMap)
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
    while (i--) virtualItems[i].virtualViewIndex = -1
    i = data.length
    while (i--) data[i].virtualViewIndex = i

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
    this.setScrollMain(0)
    this.anchorIndex = 0
    this.anchorOffsetRatio = 0

    // 重新切片当前 viewport 需要的数据
    this._updateSliceRange(FORCE_SLICE)

    dispatchEvent(this, DATA_VIEW_CHANGE, this._pluckData(this.virtualViewItems))
  }

  // 上下两端预先批量渲染的项目波动量
  // 原理是，每次插入删除都是一个小批量动作，
  // 而不是每次只插入一条、销毁一条
  // 计算出的局部渲染数据范围，跟上一次计算出来的结果，差距
  // 在这个波动量范围内，则不重新切片渲染，用于
  // 防止频繁插入内容导致性能压力
  preRenderingCount(viewportSize) {
    return 0
    // 默认预渲染 1 屏
    const len = this.virtualSliceItems.length
    const defaults = Math.ceil(viewportSize / this.defaultItemSize)
    return len ? Math.min(len, defaults) : defaults
  }

  // 滚动到上下方剩下多少个条目时，加载下一批
  // 防止 iOS 快速触摸滚动时的白屏
  preRenderingThreshold(viewportSize) {
    return 0
    // 默认触达预渲染的一半数量时，加载下一批切片
    return Math.floor(this.preRenderingCount(viewportSize) / 2)
  }

  // 滚动到锚定位置，仅在高度都已经计算后才生效，否则滚动到目的地，
  // 高度经过计算发生变化的话，无法对准
  scrollToIndex(anchorIndex, anchorOffsetRatio = 0) {
    if (anchorIndex < this.virtualViewItems.length) {
      const start = this._itemOffset(anchorIndex)
      const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio)
      let scroll = start - offset
      if (scroll < 0) scroll = 0
      if (scroll > this.canvasMainSize - this.viewportMainSize) scroll = this.canvasMainSize - this.viewportMainSize
      this.setScrollMain(scroll)
    }
  }

  /**
   * 设置 viewport 主轴方向滚过去的距离
   */
  setScrollMain(value) {
    this.$viewport[this.direction === Direction.Horizontal ? 'scrollLeft' : 'scrollTop'] = value
  }

  _updateSliceRange(forceUpdate) {
    const viewportSize = this.direction === Direction.Horizontal ? this.$viewport.clientWidth : this.$viewport.clientHeight
    const viewportStart = this.direction === Direction.Horizontal ? this.$viewport.scrollLeft : this.$viewport.scrollTop

    // 计算出准确的切片区间
    const range = this._calcSliceRange(viewportSize, viewportStart)
    if (range.sliceFrom === this.sliceFrom && range.sliceTo === this.sliceTo && !forceUpdate) {
      return
    }

    this.anchorIndex = range.sliceFrom
    this.anchorOffsetRatio = range.anchorOffsetRatio

    // 上下方额外多渲染的条目波动量
    const COUNT = this.preRenderingCount(viewportSize)

    // 预渲染触发阈值
    const THRESHOLD = this.preRenderingThreshold(viewportSize)

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


  _doSlice(fromIndex, toIndex) {
    const virtualViewItems = this.virtualViewItems
    const slice = []

    for (let i = fromIndex; i < toIndex; i += 1) {
      const wrappedItem = virtualViewItems[i]
      if (wrappedItem.height > 0) slice.push(wrappedItem)
    }

    const oldSlice = this.virtualSliceItems.slice()
    this.virtualSliceItems = slice

    dispatchEvent(this, SLICE_CHANGE, this._pluckData(slice), this._pluckData(oldSlice))

    this.render()
  }

  // 根据当前屏幕上的条目，更新尺寸
  _updateSizeByItems(nodeItems) {
    if (!nodeItems?.length) return

    const batch = []
    forEach(nodeItems, ($node) => {
      const wrappedItem = this.getVirtualItemByNode($node)

      // wrappedItem 在复杂的情况下，可能出现 undefined
      if (!wrappedItem) return

      // 获取高度
      const height = this.itemSizeMethod($node, {
        virtualKey: wrappedItem.virtualKey,
        height: wrappedItem.height,
        calculated: wrappedItem.calculated,
        virtualViewIndex: wrappedItem.virtualViewIndex,
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
        return hasChange ? { key: wrappedItem.virtualKey, value: height } : null
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
    const index = wrappedItem.virtualViewIndex
    if (index !== -1) {
      // 小于等于零表示折叠不显示，计算高度为零
      // 负值存在 wrappedItem 中，用于反折叠时恢复
      this.itemHeightStore.writeSingle(index, height > 0 ? height : 0)
    }

    return hasChange
  }

  // 通过 DOM Node 获取对应的数据
  getVirtualItemByNode($node) {
    return this.virtualItemMap[$node.virtualKey]
  }

  getVirtualItemByKey(virtualKey) {
    return this.virtualItemMap[virtualKey]
  }

  getNodeByVirtualKey(virtualKey) {
    return this.$list.querySelector(`[data-virtual-key="${virtualKey}"]`)
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
}

if (!customElements.get('bl-vlist')) {
  customElements.define('bl-vlist', BlocksVList)
}
