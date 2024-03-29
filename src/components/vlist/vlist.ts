import type { BlScrollable } from '../scrollable/index.js'
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import type { Schedule } from './schedule.js'
import '../icon/index.js'
import '../scrollable/index.js'
import { attr } from '../../decorators/attr/index.js'
import { chunkIterate } from '../../common/chunkIterate.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { dispatchEvent } from '../../common/event.js'
import { find, findLast, forEach } from '../../common/utils.js'
import { contentTemplate, itemTemplate, loadingTemplate } from './template.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { syncSchedule } from './schedule.js'
import { BinaryIndexedTree } from './BinaryIndexedTree.js'
import { BlComponent } from '../component/Component.js'

const FORCE_SLICE = true

const Direction = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
} as const

type DirectionUnion = typeof Direction.Vertical | typeof Direction.Horizontal

type ElementWithData = HTMLElement & {
  virtualKey: string
  virtualViewIndex: number
}

const ITEMS_SIZE_UPDATE = 'items-size-change'
const DATA_BOUND = 'data-bound'
const DATA_VIEW_CHANGE = 'view-data-change'
const SLICE_CHANGE = 'slice-change'
const BEFORE_RENDER = 'before-render'
const AFTER_RENDER = 'after-render'

export interface VListEventMap extends BlComponentEventMap {
  [ITEMS_SIZE_UPDATE]: CustomEvent<Array<{ key: string; value: number }>>
  [DATA_BOUND]: CustomEvent<{
    virtualData: VirtualItem[]
    virtualDataMap: Record<string, VirtualItem>
  }>
  [DATA_VIEW_CHANGE]: CustomEvent<{ getData: () => any[] }>
  [SLICE_CHANGE]: CustomEvent<{ slice: any[]; oldSlice: any[] }>
  [BEFORE_RENDER]: CustomEvent
  [AFTER_RENDER]: CustomEvent
}

type ItemOptions = {
  virtualKey?: string
  height?: number
  calculated?: boolean
  virtualViewIndex?: number
  data: object
}
// 列表项数据包裹，data 字段存放原始数据
// 组件所有操作不应该改变 data 的内容，而是修改该包裹对象的属性
export interface VirtualItem {
  // 数据的唯一id，对应 keyMethod 的值，如果没有
  // 配置 keyMethod 则是初始化数据时候的序号
  // 每次传入的 data 改变，都会重新生成
  virtualKey: string
  // 条目高度
  // 1. 正数代表已经计算出来的高度
  // 2. 0 代表未计算的高度，不显示
  // 3. 负数代表需要隐藏的高度，隐藏前已计算出来的高度为其绝对值，方便取消隐藏
  // 用途：
  // 1. 用于重建高度存储时快速恢复
  // 2. 用于快速通过数据取高度
  height: number
  // 记录是否已经根据实际 DOM 计算过高度
  calculated: boolean
  // 条目在当前过滤视图中的序号
  // 每次生成视图数据都刷新
  virtualViewIndex: number
  // 原始数据的引用
  data: object
}
export class VirtualItem {
  constructor(options: ItemOptions) {
    this.virtualKey = options.virtualKey!
    this.height = (options.height ?? 0) >> 0
    this.calculated = !!options.calculated
    this.virtualViewIndex = options.virtualViewIndex ?? -1
    this.data = options.data


  }
}

export interface BlVList extends BlComponent {
  beforeRender?(): void
  afterRender?(): void
  keyMethod?(data: object): string

  /**
   * 列表项渲染方法，子类需要实现该方法。
   *
   * @param {Element} $item
   * @param {VirtualItem} vitem
   */
  itemRender($item: HTMLElement, vitem: any): void
}

@defineClass({
  styles: [style],
})
export class BlVList extends BlComponent {
  static override get observedAttributes() {
    return ['show-busy']
  }

  @attr('enum', { enumValues: [Direction.Vertical, Direction.Horizontal] })
  accessor direction: DirectionUnion = Direction.Vertical

  @attr('int', {
    defaults: (self: BlVList) => {
      // list 的 dom 没有挂载之前，
      // 尽管 shadowRoot 中已经存在 css，但依然无法获取到，因此末尾使用 32 兜底，以免最终渲染为 0 列表不显示
      const size = parseInt(getComputedStyle(self).getPropertyValue('--item-height'), 10) || 32
      return size
    },
  })
  accessor defaultItemSize!: number

  /** TODO: 条目是否固定高度 */
  @attr('boolean') accessor fixedItemSize!: boolean

  @attr('boolean') accessor shadow!: boolean

  // 内容容器侧轴方向尺寸
  @attr('number', {
    defaults(self: BlVList) {
      return self.viewportCrossSize
    },
  })
  accessor crossSize!: number

  sliceFrom?: number
  sliceTo?: number
  anchorIndex?: number
  anchorOffsetRatio?: number
  clearDomEvents?(): void

  #$pool: HTMLElement[] = []

  // 原始数据
  #rawData: object[] = []

  // state
  protected isDataBound = false
  protected isDataBinding = false

  // 虚拟数据（从原始数据映射而来）
  protected virtualData: VirtualItem[] = []
  // 视图数据（虚拟数据进行筛选、排序后的条目，是虚拟数据的子集）
  protected virtualViewData: VirtualItem[] = []
  // 切片数据（视图数据的子集，局部渲染的条目）
  protected virtualSliceData: VirtualItem[] = []
  // 虚拟数据的 key --> Item 映射，提高访问性能
  protected virtualDataMap: Record<string, VirtualItem> = Object.create(null)
  // 条目定位信息存储
  protected itemHeightStore: BinaryIndexedTree

  @shadowRef('#viewport') accessor $viewport!: BlScrollable
  @shadowRef('#list-size') accessor $listSize!: HTMLElement
  @shadowRef('#list') accessor $list!: HTMLElement
  @shadowRef('#loading') accessor $busy!: HTMLElement

  constructor() {
    super()

    this.appendShadowChildren([contentTemplate(), loadingTemplate()])

    // 视图条目对应的条目高度存储
    this.itemHeightStore = new BinaryIndexedTree({
      defaultFrequency: this.defaultItemSize!,
      maxVal: 0,
    })

    this.hook.onConnected(() => {
      this.initDomEvent()
      this.upgradeProperty(['data'])
    })
    this.hook.onDisconnected(() => {
      if (this.clearDomEvents) {
        this.clearDomEvents()
      }
    })

    this.hook.onAttributeChangedDeps(['fixed-item-size', 'default-item-size', 'direction'], () => {
      this._resetCalculated()
      this.redraw()
    })
    this.hook.onAttributeChangedDeps(['show-busy'], () => {
      this.redraw()
    })
    this.hook.onAttributeChangedDep('shadow', () => {
      this.redraw()
      this.$viewport.shadow = this.shadow
    })
  }

  get data() {
    return this.getData()
  }

  set data(value) {
    this.setData(value)
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
  get mainSize() {
    return this.itemHeightStore!.read(this.itemHeightStore!.maxVal)
  }

  get hasMainScrollbar() {
    return this.direction === Direction.Vertical
      ? this.$viewport.hasVerticalScrollbar
      : this.$viewport.hasHorizontalScrollbar
  }

  get hasCrossScrollbar() {
    return this.direction === Direction.Vertical
      ? this.$viewport.hasHorizontalScrollbar
      : this.$viewport.hasVerticalScrollbar
  }

  initDomEvent() {
    if (this.clearDomEvents) {
      this.clearDomEvents()
    }

    // 虚拟列表滚动数据渲染
    const onScroll = this._updateSliceRange.bind(this, undefined)
    this.$viewport.addEventListener('bl:scroll', onScroll)

    // 容器尺寸变化，完全重绘
    const onResize = () => {
      this._resetCalculated()
      this.redraw()
      this.restoreAnchor()
    }
    this.$viewport.addEventListener('bl:resize', onResize)

    this.clearDomEvents = () => {
      this.$viewport.removeEventListener('bl:scroll', onScroll)
      this.$viewport.removeEventListener('bl:resize', onResize)
      this.clearDomEvents = undefined
    }
  }

  getData() {
    return this.#rawData
  }

  setData(
    value: object[],
    options: {
      schedule?: Schedule
      complete?: () => void
    } = {}
  ) {
    const data = Array.isArray(value) ? value : []
    this.bindData(
      data,
      Object.assign(
        {
          schedule: syncSchedule,
          complete: () => {
            /*noop*/
          },
        },
        options
      )
    )
  }

  /**
   * 列表项的尺寸计算方法
   *
   * @param {*} $node
   * @param {*} options
   * @returns {number}
   */
  itemSizeMethod($node: HTMLElement, options: any): number {
    if (this.fixedItemSize) {
      return this.defaultItemSize
    }

    return options.calculated
      ? options.height
      : options.direction === Direction.Horizontal
      ? $node.offsetWidth
      : $node.offsetHeight
  }

  /**
   * 检查树中，是否存在指定 treeNodeKey 的结点
   */
  hasKey(virtualKey: string): boolean {
    return !!this.virtualDataMap[virtualKey]
  }

  override render() {
    super.render()

    if (!this.isDataBound && !this.isDataBinding && this.virtualData!.length) {
      this.generateViewData({
        complete: () => {
          /*noop*/
        },
      })
      return
    }

    if (this.beforeRender) {
      this.beforeRender()
    }
    dispatchEvent(this, BEFORE_RENDER)

    this._updateListSize()
    const renderCount = this.virtualSliceData!.length

    if (renderCount === 0) {
      this.$list.style.transform = ''
      this.$list.innerHTML = ''
      return
    }

    // 列表中，存在多少个动画元素
    const transitionItemCount = this.$list.querySelectorAll('.transition').length

    if (this.direction === Direction.Horizontal) {
      this.$list.style.transform = `translateX(${this._itemOffset(this.sliceFrom!)}px)`
    } else {
      this.$list.style.transform = `translateY(${this._itemOffset(this.sliceFrom!)}px)`
    }

    const sliceItems = this.virtualSliceData
    const getFirst = () =>
      transitionItemCount
        ? find(this.$list.children, $item => ($item as any).virtualViewIndex != null)
        : this.$list.firstElementChild
    const getLast = () =>
      transitionItemCount
        ? findLast(this.$list.children, $item => ($item as any).virtualViewIndex != null)
        : this.$list.lastElementChild

    // 渲染条目 DOM，针对滚动的场景做优化
    const startKey = sliceItems[0].virtualViewIndex
    const endKey = sliceItems[sliceItems.length - 1].virtualViewIndex
    const startItemKey = (getFirst() as any)?.virtualViewIndex
    const endItemKey = (getLast() as any)?.virtualViewIndex

    // 上滚
    if (endKey < endItemKey || (endKey === endItemKey && startKey < startItemKey)) {
      // 结尾对齐
      let $last
      while (this.$list.children.length && ($last = getLast() as any)?.virtualViewIndex !== endKey) {
        $last && this.#$pool.push(this.$list.removeChild($last))
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this.#$pool.push(this.$list.removeChild(this.$list.firstElementChild as HTMLElement))
      }
      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.insertBefore(this.#$pool.pop() ?? itemTemplate(), this.$list.firstElementChild)
      }
    } else {
      // 下滚
      if (startKey > startItemKey || (startKey === startItemKey && endKey > endItemKey)) {
        // 开头对齐
        let $first
        while (this.$list.children.length && ($first = getFirst() as any)?.virtualViewIndex !== startKey) {
          $first && this.#$pool.push(this.$list.removeChild($first) as HTMLElement)
        }
      }

      // 保证数量一致
      while (this.$list.children.length > renderCount + transitionItemCount) {
        this.#$pool.push(this.$list.removeChild(this.$list.lastElementChild as HTMLElement))
      }

      while (this.$list.children.length < renderCount + transitionItemCount) {
        this.$list.appendChild(this.#$pool.pop() ?? itemTemplate())
      }
    }
    this.#$pool = []

    // 渲染条目内部内容
    let i = -1
    let j = -1
    while (++i < this.$list.children.length) {
      const $item = this.$list.children[i] as ElementWithData
      if ($item.classList.contains('transition')) continue
      const vitem = sliceItems[++j]

      if (!vitem) return
      $item.virtualKey = $item.dataset.virtualKey = vitem.virtualKey
      $item.virtualViewIndex = vitem.virtualViewIndex
      if (this.fixedItemSize) {
        $item.style.height = this.defaultItemSize + 'px'
      } else {
        $item.style.height = ''
      }
      this.itemRender($item, vitem)
    }

    // 过滤出未计算过高度的条目
    this._updateSizeByItems(this.$list.children as unknown as ElementWithData[])

    if (this.afterRender) {
      this.afterRender()
    }
    dispatchEvent(this, AFTER_RENDER)
  }

  // 刷新列表高度、重新切片渲染
  redraw(): void {
    this._updateListSize()
    this._updateSliceRange(FORCE_SLICE)
  }

  filterMethod<T>(data: T[], callback: (data: T[]) => any): any {
    callback(data)
  }

  sortMethod<T>(data: T[], callback: (data: T[]) => any): any {
    callback(data)
  }

  // 包裹原始数据，并生成一些辅助数据结构，派发事件
  bindData(
    data: object[],
    options: {
      complete: () => void
      schedule: Schedule
    }
  ) {
    if (this.isDataBound && data === this.#rawData) {
      return options.complete()
    }
    this.#rawData = data

    // 注意，如果 schedule 不是使用异步调度，则 buzy 状态没有机会展示
    this.isDataBinding = true
    this.$busy.style.display = ''

    options.schedule(() => {
      this.virtualMap(data, {
        schedule: options.schedule,
        complete: virtualData => {
          // 构建 virtualItemMap，形成 key-data 映射，方便后续快速查找数据
          const virtualDataMap = Object.create(null)
          let i = virtualData.length
          while (i--) {
            virtualDataMap[virtualData[i].virtualKey] = virtualData[i]
          }

          // 如果存在旧数据，并且配置了自定义 key 字段，
          // 则尝试从旧数据中恢复信息
          const oldVirtualDataMap = this.virtualDataMap
          if (oldVirtualDataMap && this.keyMethod) {
            let i = virtualData.length
            while (i--) {
              const vItem = virtualData[i]
              const oldVItem = oldVirtualDataMap[vItem.virtualKey]
              if (oldVItem) {
                vItem.height = oldVItem.height
              }
            }
          }

          this.virtualData = virtualData
          this.virtualDataMap = virtualDataMap

          this.$busy.style.display = 'none'
          this.isDataBinding = false
          this.isDataBound = true

          // 完成后，抛出事件
          dispatchEvent(this, DATA_BOUND, {
            detail: { virtualData, virtualDataMap },
          })

          this.generateViewData(options)
        },
      })
    })
  }

  /**
   * 映射原始数据列表为虚拟数据列表
   * 子类根据需要重写该方法
   */
  virtualMap(
    data: object[],
    options: {
      schedule: Schedule
      complete: (virtualData: VirtualItem[]) => void
    }
  ) {
    const virtualData: VirtualItem[] = []
    const convert = (data: object, index: number) => {
      const virtualKey = this.keyMethod ? this.keyMethod(data) : String(index)
      const vitem = new VirtualItem({
        virtualKey,
        height: this.defaultItemSize!,
        data,
      })
      virtualData.push(vitem)
    }
    chunkIterate(data, convert, {
      chunkSize: 10000,
      schedule: options.schedule,
      complete: () => {
        options.complete(virtualData)
      },
    })
  }

  /**
   * 从虚拟列表数据中，提取子集，作为当前过滤、排序条件下的数据。
   * 修改过滤方法、排序方法后，需要调用该方法重新生成数据。
   */
  generateViewData(options: { complete: () => void }) {
    const { virtualData } = this
    const data = virtualData.slice()
    this.sortMethod(data, data => {
      this.filterMethod(data, data => {
        // 重新记录数据在视图中的位置，用于隐藏部分条目时，可以精确计算高度、坐标
        let i = virtualData.length
        while (i--) virtualData[i].virtualViewIndex = -1
        i = data.length
        while (i--) data[i].virtualViewIndex = i

        // 重建高度存储
        this.itemHeightStore = new BinaryIndexedTree({
          defaultFrequency: this.defaultItemSize!,
          maxVal: data.length,
        })

        // 从缓存中快速恢复已计算出高度的条目的高度
        for (let index = 0, size = data.length; index < size; index += 1) {
          const node = data[index]
          // 小于零的需要隐藏，所以高度为 0
          this.itemHeightStore.writeSingle(index, 1 / node.height > 0 ? node.height : 0)
        }

        this.virtualViewData = data

        // 刷新列表高度
        this._updateListSize()

        // 重置滚动位置
        this.setScrollMain(0)
        this.anchorIndex = 0
        this.anchorOffsetRatio = 0

        // 重新切片当前 viewport 需要的数据
        this._updateSliceRange(FORCE_SLICE)

        dispatchEvent(this, DATA_VIEW_CHANGE, {
          detail: {
            getData: () => this._pluckData(this.virtualViewData),
          },
        })

        options.complete()
      })
    })
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
  async showByKeys(keys: string[], withoutAnimation?: boolean) {
    // 如果存在未结束的动画，提前结束
    await this._clearTransition()

    const changes = keys
      .map(key => this.virtualDataMap[key])
      .filter(vItem => Number(vItem?.height) <= 0)
      .map(vItem => {
        const height = -vItem.height || this.defaultItemSize!
        const hasChange = this._updateSize(vItem, height)
        return hasChange ? { key: vItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    // 刷新列表
    this._updateSliceRange(FORCE_SLICE)

    if (withoutAnimation) {
      if (changes.length) {
        dispatchEvent(this, ITEMS_SIZE_UPDATE, {
          detail: changes,
        })
      }
      this.redraw()
      return
    }

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')
    const items: ElementWithData[] = []
    let $first: ElementWithData
    forEach(this.$list.children as any, ($item: ElementWithData) => {
      if (keys.includes($item.virtualKey)) {
        if (!$first) $first = $item
        items.push($item)
      }
    })
    const size = items.reduce(
      (acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'],
      0
    )
    this.$list.insertBefore($collapse, $first!)
    items.reverse()
    while (items.length) {
      $collapse.appendChild(items.pop()!)
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

    if (changes.length) {
      dispatchEvent(this, ITEMS_SIZE_UPDATE, { detail: changes })
    }
  }

  /**
   * 通过数据 key 列表，设置对应条目的显示状态
   */
  async hideByKeys(keys: string[], withoutAnimation?: boolean) {
    // 如果存在未结束的动画，提前结束
    await this._clearTransition()

    const changes = keys
      .map(key => this.virtualDataMap[key])
      .filter(vItem => Number(vItem?.height) > 0)
      .map(vItem => {
        // 设置为负数，表示隐藏
        const height = -vItem.height
        vItem.height = height
        const hasChange = this._updateSize(vItem, height)
        return hasChange ? { key: vItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    if (withoutAnimation) {
      if (changes.length) {
        dispatchEvent(this, ITEMS_SIZE_UPDATE, { detail: changes })
      }
      this.redraw()
      return
    }

    // 过渡动画
    const $collapse = document.createElement('div')
    $collapse.classList.add('transition')

    const items: ElementWithData[] = []
    let $first: ElementWithData
    forEach(this.$list.children as unknown as ElementWithData[], $item => {
      if (keys.includes($item.virtualKey)) {
        if (!$first) $first = $item
        items.push($item)
      }
    })
    const size = items.reduce(
      (acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'],
      0
    )
    if ($first!) {
      this.$list.insertBefore($collapse, $first)
    }
    items.reverse()
    while (items.length) {
      $collapse.appendChild(items.pop()!)
    }
    if ($collapse.children.length) {
      $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`
      doTransitionEnter($collapse, 'collapse', () => {
        this.$list.removeChild($collapse)
        this.redraw()
      })
    }

    this.nextTick(() => this.redraw())
    if (changes.length) {
      dispatchEvent(this, ITEMS_SIZE_UPDATE, {
        detail: changes,
      })
    }
  }

  /**
   * 显示所有条目
   */
  showAll() {
    const changes = this.virtualViewData
      .map(vItem => {
        const height = -vItem.height || this.defaultItemSize
        const hasChange = this._updateSize(vItem, height)
        return hasChange ? { key: vItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    this.redraw()

    if (changes.length) {
      dispatchEvent(this, ITEMS_SIZE_UPDATE, {
        detail: changes,
      })
    }
  }

  nextTick(callback: () => void) {
    queueMicrotask(callback)
  }

  // 上下两端预先批量渲染的项目波动量
  // 原理是，每次插入删除都是一个小批量动作，
  // 而不是每次只插入一条、销毁一条
  // 计算出的局部渲染数据范围，跟上一次计算出来的结果，差距
  // 在这个波动量范围内，则不重新切片渲染，用于
  // 防止频繁插入内容导致性能压力
  preRenderingCount(viewportSize: number) {
    return 0
    // // 默认预渲染 1 屏
    // const len = this.virtualSliceData.length
    // const defaults = Math.ceil(viewportSize / this.defaultItemSize)
    // return len ? Math.min(len, defaults) : defaults
  }

  // 滚动到上下方剩下多少个条目时，加载下一批
  // 防止 iOS 快速触摸滚动时的白屏
  preRenderingThreshold(viewportSize: number) {
    return 0
    // // 默认触达预渲染的一半数量时，加载下一批切片
    // return Math.floor(this.preRenderingCount(viewportSize) / 2)
  }

  // 滚动到锚定位置，仅在高度都已经计算后才生效，否则滚动到目的地，
  // 高度经过计算发生变化的话，无法对准
  scrollToIndex(anchorIndex: number, anchorOffsetRatio = 0) {
    if (anchorIndex >= 0 && anchorIndex < this.virtualViewData.length) {
      const start = this._itemOffset(anchorIndex)
      const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio)
      let scroll = start - offset
      if (scroll < 0) scroll = 0
      if (scroll > this.mainSize - this.viewportMainSize) scroll = this.mainSize - this.viewportMainSize
      this.setScrollMain(scroll)
    }
  }

  // 往前滚动到锚定位置（上一项出现在容器末尾）
  backScrollToIndex(anchorIndex: number, anchorOffsetRatio = 0) {
    if (anchorIndex >= 0 && anchorIndex < this.virtualViewData.length) {
      const start = this._itemOffset(anchorIndex) + this._itemSize(anchorIndex) - this.viewportMainSize
      const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio)
      let scroll = start + offset
      if (scroll < 0) scroll = 0
      if (scroll > this.mainSize - this.viewportMainSize) scroll = this.mainSize - this.viewportMainSize
      this.setScrollMain(scroll)
    }
  }

  /**
   * 滚动到指定数据 key 的条目位置
   */
  scrollToKey(key: string, anchorOffsetRatio: number) {
    const vitem = this.virtualDataMap[key]
    if (vitem.virtualViewIndex !== -1) {
      this.scrollToIndex(vitem.virtualViewIndex, anchorOffsetRatio)
    }
  }

  /**
   * 往前滚动到指定数据 key 的条目位置
   */
  backScrollToKey(key: string, anchorOffsetRatio: number) {
    const vitem = this.virtualDataMap[key]
    if (vitem.virtualViewIndex !== -1) {
      this.backScrollToIndex(vitem.virtualViewIndex, anchorOffsetRatio)
    }
  }

  /**
   * 重新滚动到锚点
   */
  restoreAnchor() {
    if (this.anchorIndex) {
      this.scrollToIndex(this.anchorIndex, this.anchorOffsetRatio)
    }
  }

  /**
   * 获取 viewport 主轴方向滚过去的距离
   */
  getScrollMain() {
    return this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollLeft' : 'viewportScrollTop']
  }

  /**
   * 获取 viewport 侧轴方向滚过去的距离
   */
  getScrollCross() {
    return this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollTop' : 'viewportScrollLeft']
  }

  /**
   * 设置 viewport 主轴方向滚过去的距离
   */
  setScrollMain(value: number) {
    this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollLeft' : 'viewportScrollTop'] = value
  }

  /**
   * 设置 viewport 侧轴方向滚过去的距离
   */
  setScrollCross(value: number) {
    this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollTop' : 'viewportScrollLeft'] = value
  }

  // 更新数据切片范围，可以提供 ture 参数强制重新绘制
  _updateSliceRange(forceUpdate?: boolean) {
    const viewportSize =
      this.direction === Direction.Horizontal ? this.$viewport.clientWidth : this.$viewport.clientHeight
    const viewportStart =
      this.direction === Direction.Horizontal ? this.$viewport.viewportScrollLeft : this.$viewport.viewportScrollTop

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
    const MAX = this.virtualViewData.length

    // 检查计算出来的切片范围，是否被当前已经渲染的切片返回包含了
    // 如果是，无需更新切片，（如果 forceUpdate，则无论如何都需要重新切片）
    let fromThreshold = range.sliceFrom - THRESHOLD
    if (fromThreshold < 0) fromThreshold = 0
    let toThreshold = range.sliceTo + THRESHOLD
    if (toThreshold > MAX) toThreshold = MAX

    // 无需强制刷新，且上下两端都没有触达阈值时，无需重新切片
    if (!forceUpdate && this.sliceFrom! <= fromThreshold && this.sliceTo! >= toThreshold) {
      // console.log('无需切片', `O(${this.sliceFrom},${this.sliceTo}), N(${fromThreshold},${toThreshold})`)
      return
    }

    // 更新切片的情况
    // console.log('需切片', `O(${this.sliceFrom},${this.sliceTo}), N(${fromThreshold},${toThreshold})`)

    // 在切片区间头部、尾部，追加预渲染的条目
    let { sliceFrom, sliceTo } = range
    sliceFrom = sliceFrom > COUNT ? sliceFrom - COUNT : 0
    sliceTo = sliceTo + COUNT > MAX ? MAX : sliceTo + COUNT

    const shouldDoSlice = forceUpdate || this.sliceFrom !== sliceFrom || this.sliceTo !== sliceTo

    this.sliceFrom = sliceFrom
    this.sliceTo = sliceTo

    if (shouldDoSlice) {
      this._doSlice(sliceFrom, sliceTo)
    }
  }

  // 计算局部渲染数据切片的起止点
  _calcSliceRange(viewportSize: number, viewportStart: number) {
    if (!this.virtualViewData.length) {
      return { sliceFrom: 0, sliceTo: 0, anchorOffsetRatio: 0 }
    }

    const MIN_INDEX = 0
    const MAX_INDEX = this.virtualViewData.length - 1

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

  // 根据切片返回裁剪数据片段，进行绘制
  _doSlice(fromIndex: number, toIndex: number) {
    const virtualViewItems = this.virtualViewData
    const slice = []

    for (let i = fromIndex; i < toIndex; i += 1) {
      const vItem = virtualViewItems[i]
      if (vItem.height > 0) slice.push(vItem)
    }

    const oldSlice = this.virtualSliceData.slice()
    this.virtualSliceData = slice

    dispatchEvent(this, SLICE_CHANGE, {
      detail: {
        slice: this._pluckData(slice),
        oldSlice: this._pluckData(oldSlice),
      },
    })

    this.render()
  }

  // 根据当前屏幕上的条目，更新尺寸
  _updateSizeByItems(nodeItems: ElementWithData[]) {
    if (!nodeItems?.length) return

    const batch: any[] = []
    forEach(nodeItems, $node => {
      const vItem = this.getVirtualItemByNode($node)

      // vItem 在复杂的情况下，可能出现 undefined
      if (!vItem) return

      // 获取高度
      const height =
        this.itemSizeMethod($node, {
          virtualKey: vItem.virtualKey,
          height: vItem.height,
          calculated: vItem.calculated,
          virtualViewIndex: vItem.virtualViewIndex,
          direction: this.direction,
        }) >> 0

      // 可能组件隐藏中
      if (height === 0) return

      // 计算出来的高度跟旧高度或默认值一致，
      // 则无需更新，但是设置已经计算状态
      // 以便下次可以直接使用缓存
      if (vItem.height === height) {
        vItem.calculated = true
      }

      // 高度不一致，则设置标识，需要在批处理中进行刷新
      else {
        batch.push({ vItem, height, calculated: true })
      }
    })

    if (batch.length) {
      this._batchUpdateHeight(batch)
    }
  }

  // Dom 插入时候，计算高度，然后
  // 批量刷新高度，避免频繁调整列表高度带来性能问题
  _batchUpdateHeight(records: any[]) {
    const changes = records
      .map(({ vItem, height, calculated }) => {
        const hasChange = this._updateSize(vItem, height, calculated)
        return hasChange ? { key: vItem.virtualKey, value: height } : null
      })
      .filter(item => !!item)

    if (changes.length) {
      this._updateListSize()
      this._updateSliceRange(true)

      dispatchEvent(this, ITEMS_SIZE_UPDATE, {
        detail: changes,
      })
    }
  }

  // 刷新列表项高度
  _updateSize(vItem: VirtualItem, height: number, calculated?: boolean) {
    height = height >> 0

    const hasChange = height !== vItem.height

    // 更新结点高度缓存
    vItem.height = height

    if (calculated != null) {
      vItem.calculated = calculated
    }

    // 如果 vItem 为当前过滤下的项目，
    // 则同时刷新高度存储 store
    const index = vItem.virtualViewIndex
    if (index !== -1) {
      // 小于等于零表示折叠不显示，计算高度为零
      // 负值存在 vItem 中，用于反折叠时恢复
      this.itemHeightStore.writeSingle(index, height > 0 ? height : 0)
    }

    return hasChange
  }

  // 通过 DOM Node 获取对应的数据
  getVirtualItemByNode($node: ElementWithData): VirtualItem {
    return this.virtualDataMap[$node.virtualKey]
  }

  // 通过 key 获取对应的数据条目
  getVirtualItemByKey(virtualKey: string): VirtualItem {
    return this.virtualDataMap[virtualKey]
  }

  // 通过 key 获取对应的数据 DOM
  getNodeByVirtualKey(virtualKey: string): HTMLElement {
    return this.$list.querySelector(`[data-virtual-key="${virtualKey}"]`) as HTMLElement
  }

  // 将包裹数据列表，转换成原始数据列表
  _pluckData(virtualData: VirtualItem[]): any[] {
    const data: any[] = []
    for (let i = 0, len = virtualData.length; i < len; i += 1) {
      data.push(virtualData[i].data)
    }
    return data
  }

  // 刷新列表尺寸
  // ! 注意，浏览器支持的元素的尺寸是存在上限的，
  // ! list 的尺寸超过一定程度后，无法正确滚动到底。
  _updateListSize(): void {
    const { itemHeightStore } = this
    if (itemHeightStore) {
      if (this.direction === Direction.Horizontal) {
        this.$list.style.width = ''
        this.$list.style.height = this.$listSize.style.height = this.crossSize ? `${this.crossSize}px` : ''
        this.$listSize.style.width = `${itemHeightStore.read(itemHeightStore.maxVal)}px`
      } else {
        this.$list.style.height = ''
        this.$list.style.width = this.$listSize.style.width = this.crossSize ? `${this.crossSize}px` : ''
        this.$listSize.style.height = `${itemHeightStore.read(itemHeightStore.maxVal)}px`
      }
    }
    this.$viewport.toggleViewportClass('main-scrollbar', this.hasMainScrollbar)
    this.$viewport.toggleViewportClass('cross-scrollbar', this.hasCrossScrollbar)
  }

  // 重置尺寸的已计算状态，用于已计算出来的值全部失效的情况
  // 例如组件尺寸变化，导致每项的换行情况发生变化
  // 此时需要彻底重新计算
  _resetCalculated(): void {
    const virtualData = this.virtualData
    let i = virtualData.length
    while (i--) virtualData[i].calculated = false
  }

  // `index`: 数据在 virtualViewItems 中的 index
  _itemSize(index: number): number {
    if (index >= this.itemHeightStore.maxVal!) index = this.itemHeightStore.maxVal - 1
    return this.itemHeightStore.readSingle(index)
  }

  // `index`: 数据在 virtualViewItems 中的 index
  _itemOffset(index: number): number {
    // 0 ～ 上一项的高度累加
    return this.itemHeightStore.read(index)
  }

  // 提前结束动画
  _clearTransition(): Promise<boolean> {
    let flag = false
    forEach(this.$list.querySelectorAll('.transition'), $transition => {
      flag = true
      $transition.className = 'transition'
    })
    if (!flag) return Promise.resolve(flag)
    return new Promise(resolve => setTimeout(() => resolve(flag), 50))
  }

  override addEventListener<K extends keyof VListEventMap>(
    type: K,
    listener: BlComponentEventListener<VListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options)
  }

  override removeEventListener<K extends keyof VListEventMap>(
    type: K,
    listener: BlComponentEventListener<VListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type, listener, options)
  }
}
