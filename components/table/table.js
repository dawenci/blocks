import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import RowColumn from './RowColumn.js'
import '../scrollable/index.js'
import './header.js'
import './body.js'
import { __border_color_light, __color_danger_light } from '../../theme/var.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  display: block;
  box-sizing: border-box;
  width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  position: relative;
  z-index: 0;
  background: #f3f3f3;
  color: $--color-text-regular;
}
:host([border]) {
  border: 1px solid var(--border-color-light, ${__border_color_light});
}

.fixed-left-shadow,
.fixed-right-shadow {
  position: absolute;
  top: 0;
  bottom: 6px;
  width: 5px;
  pointer-events: none;
}
.fixed-left-shadow {
  border-left: 1px solid var(--border-color-light, ${__border_color_light});
  background-image: linear-gradient(to right, rgba(0,0,0,.1), rgba(0,0,0,.0))
}
.fixed-right-shadow {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
  background-image: linear-gradient(to left, rgba(0,0,0,.1), rgba(0,0,0,.0))
}


/* 列宽调整柄 */
.VGrid_resize_handler {
  position: absolute;
  z-index: 2;
  top: 0;
  right: auto;
  bottom: auto;
  left: -5px;
  width: 5px;
  user-select: text;
  cursor: col-resize;
}
.VGrid_resize_handler.VGrid_resize_handler-resizing {
  background-color: #f00;
}

/* 拖拽过程，避免选中文本 */
.VGrid.VGrid-resizing {
  user-select: none;
}
`

const template = document.createElement('template')
template.innerHTML = `
<div class="VGrid" :class="{'VGrid-border': border}" :style="styleObject">
  <!-- 左固定列 -->
  <template v-if="hasFixedLeft() && shouldShowFixedColumns()">
    <div
      v-mousewheel="_onFixedMousewheel"
      class="VGridFixed VGridFixedLeft"
      :class="{VGridFixedScroll: scrollLeft}"
      :style="{
        width: fixedLeftWidth() - 1 + 'px',
        height: getHeaderHeight() + viewportHeight + 'px'
      }">
      <!-- 表头 -->
      <VGridHeader
        ref="leftHeader"
        area="left"
        :store="store"
        :viewport-width="fixedLeftWidth()"
        :canvas-width="fixedLeftWidth()"
        @enter-cell="_onEnterCell"
        @leave-cell="_onLeaveCell"
      />

      <!-- 内容 -->
      <VGridBody
        ref="leftBody"
        area="left"
        :store="store"
        :canvas-width="fixedLeftWidth()"
        :rows="rows"
        @items-size-change="_onItemsSizeChange"
        @click-row="_onClickRow"
      />
    </div>
  </template>

  <!-- 右固定列 -->
  <template v-if="hasFixedRight() && shouldShowFixedColumns()">
    <div
      v-mousewheel="_onFixedMousewheel"
      class="VGridFixed VGridFixedRight"
      :class="{VGridFixedScroll: scrollLeft + viewportWidth !== canvasWidth}"
      :style="{
        width: fixedRightWidth() + 'px',
        height: getHeaderHeight() + viewportHeight + 'px',
        right: (hasMainScrollbar ? getMainScrollbarSize() : 0) + 'px'
      }">
      <!-- 表头 -->
      <VGridHeader
        ref="rightHeader"
        area="right"
        :store="store"
        :viewport-width="fixedRightWidth()"
        :canvas-width="fixedRightWidth()"
        @enter-cell="_onEnterCell"
        @leave-cell="_onLeaveCell"
      />

      <!-- 内容 -->
      <VGridBody
        ref="rightBody"
        area="right"
        :store="store"
        :canvas-width="fixedRightWidth()"
        :rows="rows"
        @items-size-change="_onItemsSizeChange"
        @click-row="_onClickRow"
      />
    </div>
  </template>

  <!-- 页脚，合计行 -->
  <template v-if="summary">
    <VGridFooter
      ref="footer"
      :store="store"
      :viewport-width="viewportWidth"
      :canvas-width="canvasWidth"
      :scroll-left="scrollLeft"
    />
  </template>

  <!-- 列宽调整 -->
  <template>
    <div
      class="VGrid_resize_handler VGrid_resize_handler-left"
      :style="{
        left: resizeHandlerLeft + 'px',
        height: getHeaderHeight() + 'px'
      }"
      @mousedown="_onResizeStart"
    />
    <div
      class="VGrid_resize_handler VGrid_resize_handler-right"
      :style="{
        left: resizeHandlerRight + 'px',
        height: getHeaderHeight() + 'px'
      }"
      @mousedown="_onResizeStart"
    />
  </template>

  <!-- 列定义 -->
  <slot />
</div>
`


let gridId = 0

export default class BlocksTable extends HTMLElement {
  static get observedAttributes() {
    return ['border']
  }

  get border() {
    return boolGetter('border')(this)
  }

  set border(value) {
    boolSetter('border')(this, value)
  }

  get data() {
    return this._data ?? []
  }

  set data(value) {
    this._data = value
    this.$mainBody.data = value
  }

  get columns() {
    return this._columns ?? []
  }

  set columns(value) {
    this._columns = (value ?? []).map(options => new RowColumn(options))
    this.$mainHeader.columns = value
    this.$mainBody.columns = value
    this._updateFiexedColumnShadow()
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))

    this.$mainHeader = shadowRoot.appendChild(document.createElement('bl-table-header'))
    this.$mainHeader.$host = this

    this.$mainBody = shadowRoot.appendChild(document.createElement('bl-table-body'))
    this.$mainBody.$host = this

    // 水平滚动
    this.$mainBody.onscroll = (e) => {
      // 同步 header 的左右滚动
      this.$mainHeader.scrollLeft = this.$mainBody.getScrollCross()
    }

    // 如果存在固定列，渲染投影
    this.$mainBody.addEventListener('can-scroll-left-change', () => {
      this._updateFiexedColumnShadow()
    })
    this.$mainBody.addEventListener('can-scroll-right-change', () => {
      this._updateFiexedColumnShadow()
    })
  }

  _updateFiexedColumnShadow() {
    const leftSize = this.$mainBody.getFixedLeftShadowPosition()
    const rightSize = this.$mainBody.getFixedRightShadowPosition()

    if (leftSize && this.$mainBody.$viewport.canScrollLeft) {
      if (!this.$fixedLeftShadow) {
        this.$fixedLeftShadow = document.createElement('div')
        this.$fixedLeftShadow.className = 'fixed-left-shadow'
      }
      if (!this.$fixedLeftShadow.parentNode) {
        this.shadowRoot.appendChild(this.$fixedLeftShadow)
      }
      this.$fixedLeftShadow.style.left = leftSize - 1 + 'px'
    }
    else {
      if (this.$fixedLeftShadow) {
        if (this.$fixedLeftShadow.parentNode) {
          this.shadowRoot.removeChild(this.$fixedLeftShadow)
        }
      }
    }

    if (rightSize && this.$mainBody.$viewport.canScrollRight) {
      if (!this.$fixedRightShadow) {
        this.$fixedRightShadow = document.createElement('div')
        this.$fixedRightShadow.className = 'fixed-right-shadow'
      }
      if (!this.$fixedRightShadow.parentNode) {
        this.shadowRoot.appendChild(this.$fixedRightShadow)
      }
      this.$fixedRightShadow.style.right = rightSize + 'px'
    }
    else {
      if (this.$fixedRightShadow) {
        if (this.$fixedRightShadow.parentNode) {
          this.shadowRoot.removeChild(this.$fixedRightShadow)
        }
      }
    }

    this.style.minWidth = leftSize + rightSize + 80 + 'px';
  }

  render() {
    this.$mainHeader.render()
    this.$mainBody.render()
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    upgradeProperty(this, 'columns')
    upgradeProperty(this, 'data')

    this._clearResizeHandler = sizeObserve(this, () => {
      this.layout(this.getCanvasWidth())
      this.render()
      // 刷新投影座标
      this._updateFiexedColumnShadow()
    })
  }

  disconnectedCallback() {
    this._clearResizeHandler()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}


  // 获取指定条件的末级列
  // @Provide()
  getFlattenColumns(pred) {
    const columns = []
    const flat = (column, parentColumn) => {
      if (pred && !pred(column, parentColumn)) return
      if (column?.children?.length) {
        column.children.forEach(child => flat(child, column))
      }
      else {
        columns.push(column)
      }
    }
    this.columns.forEach(child => flat(child, null))
    return columns
  }

  // // 获取非固定根列下的所有末级列
  // // @Provide()
  // getFlattenNonfixedColumns() {
  //   return this.getFlattenColumns((column, parentColumn) => {
  //     // 非根节点无需判断全部 true
  //     if (parentColumn) return true
  //     // 根节点需要判断
  //     return !column.fixedLeft && !column.fixedRight
  //   })
  // }

  // 获取固定根列下的所有末级列
  // @Provide()
  // 'left' | 'right'
  getFlattenFixedColumns(area) {
    return this.getFlattenColumns((column, parentColumn) => {
      // 非根节点，无需判断，全部 true
      if (parentColumn) return true
      // 根节点，需要判断
      if (area === 'left') return column.fixedLeft
      if (area === 'right') return column.fixedRight
      return column.fixedLeft || column.fixedRight
    })
  }

  // // 是否要渲染固定列
  // // @Provide()
  // shouldShowFixedColumns() {
  //   // 1. viewport 总宽度足够，无需滚动条就可以显示所有列，则不需要固定列
  //   if (!this.$mainBody.hasCrossScrollbar) return false

  //   // 2. 所有列都设置成固定列，也没有意义，不需要固定列
  //   if (this.columns.every(column => column.fixedLeft || column.fixedRight)) {
  //     return false
  //   }

  //   // 3. 固定列的宽度超过 viewport，则不显示固定列，否则会导致主体内容无法被展示
  //   const fixedWidth = this.fixedLeftWidth() + this.fixedRightWidth()
  //   if (fixedWidth >= this.$mainBody.offsetWidth) return false

  //   return true
  // }

  // 是否有左固定列
  // @Provide()
  hasFixedLeft() {
    return this.columns.some(column => !!column.fixedLeft)
  }

  // 是否有右固定列
  // @Provide()
  hasFixedRight() {
    return this.columns.some(column => !!column.fixedRight)
  }

  // 计算左固定列的宽度
  // @Provide()
  fixedLeftWidth() {
    return this.getFlattenFixedColumns('left')
      .reduce((acc, column) => acc + column.width, 0)
  }

  // 计算右固定列的宽度
  // @Provide()
  fixedRightWidth() {
    return this.getFlattenFixedColumns('right')
      .reduce((acc, column) => acc + column.width, 0)
  }

  
  // 计算用于内容排版的画布尺寸
  // @Provide()
  getCanvasWidth() {
    const columnsMinWidth = this.getFlattenColumns()
      .reduce((acc, column) => acc + column.minWidth, 0)
    const bodyWidth = this.$mainBody?.clientWidth ?? this.width ?? 400
    return Math.max(bodyWidth, columnsMinWidth)
  }


  // 组件宽度，不设置则为容器的 100%
  // @Prop({ type: Number }) width!: number

  // 组件高度，不设置则为容器的 100%
  // @Prop({ type: Number }) height?: number

  // 显示框线
  // @Prop({ type: Boolean, default: true }) border!

  // 显示合计行
  // @Prop({ type: Boolean, default: false }) summary!

  // 数据列表
  // @Prop({ type: Array, default: () => ([]) }) data!: any[]

  // 数据排序方法
  // @Prop({ type: Function }) sortMethod?: (a: any, b: any) => number

  // 数据 id，生成 rowKey 的字段
  // @Prop({ type: String, default: 'id' }) idField!: string

  // 数据提取 id 的方法，优先级比 labelField 高
  // @Prop({ type: Function }) idMethod!: ((data: any) => string)

  // 数据禁止切换激活的检查方法
  // @Prop({ type: Function, default: () => false })
  // disableActiveMethod

  // 包裹后的行数据
  rows = []

  // 映射：key --> 行数据，方便快速定位行
  keyNodeMap = Object.freeze(Object.create(null))

  // 是否已经绑定了数据（首次加载数据）
  isDataBound = false

  // 视口宽度
  viewportWidth = 0

  // 视口高度
  viewportHeight = 0

  // 内容布局宽度
  canvasWidth = 0

  // 当前的水平滚动偏移值
  scrollLeft = 0

  // 当前的激活行
  activeRow = null

  // 当前是否有垂直滚动条
  hasMainScrollbar = false

  // 当前是否有水平滚动条
  hasCrossScrollbar = false

  resizeHandlerLeft = -5

  resizeHandlerRight = -5

  // 当前实例是否 VGrid
  gridId = ++gridId

  resizehandler = null

  resizeStartOffset = 0

  // 样式
  get styleObject() {
    return {
      width: this.width ? `${this.width}px` : '100%',
      height: this.height ? `${this.height}px` : '100%',
    }
  }

  // ID 获取方法
  get internalKeyMethod() {
    return typeof this.idMethod === 'function'
      ? this.idMethod
      : typeof this.idField === 'string'
        ? (data) => data[this.idField]
        : (data) => data.id
  }

  // 进行布局，调整各列的宽度以适配排版容器
  layout(canvasWidth) {
    this.$mainHeader.$canvas.style.width = canvasWidth + 'px'
    this.$mainBody.crossSize = canvasWidth

    // 已分配的宽度
    const sum = this.getFlattenColumns()
      .reduce((acc, column) => acc + column.width, 0)

    // 剩余未分配的宽度
    const remainingWidth = canvasWidth - sum

    // 没有未分配的尺寸，无需调整
    if (remainingWidth === 0) {
      dispatchEvent(this, 'layout')
      return
    }

    // 未分配的尺寸大于 0，需要将这些尺寸加在各个 column 上
    if (remainingWidth > 0) {
      this._expandColumns(remainingWidth, this.getFlattenColumns())
      dispatchEvent(this, 'layout')
      return
    }

    // 未分配的尺寸小于 0，需要将这些收缩量分配到 column 上
    this._shrinkColumns(-remainingWidth, this.getFlattenColumns())

    dispatchEvent(this, 'layout')
  }

  // 激活某行
  active(rowKey) {
    const row = this.keyNodeMap[rowKey]

    // 目标行不存在，则清除当前激活行后退出
    if (!row) {
      if (this.activeRow) this.activeRow.active = false
      this.activeRow = null
      return
    }

    // 目标行不允许激活，直接退出
    if (this.disableActiveMethod(row)) {
      return
    }

    // 切换激活行
    if (this.activeRow && row !== this.activeRow) {
      this.activeRow.active = false
    }
    row.active = true
    this.activeRow = row
  }

  // 获取面板允许扩张的尺寸
  _getGrowSize(column) {
    const size = column.maxWidth - column.width
    if (size > 0) return size
    return 0
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize(column) {
    const size = column.width - column.minWidth
    if (size > 0) return size
    return 0
  }

  // 将 rest 尺寸分配到 columns 上
  _expandColumns(rest, columns) {
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, columns) => {
      // 找出能接纳扩张的 column
      const list = columns.filter(column => this._getGrowSize(column) >= 1)
      if (!list.length) return

      // 均摊的尺寸
      const expand = rest / list.length
      list.forEach(column => {
        // 实际扩张的尺寸
        const actual = Math.min(this._getGrowSize(column), expand)
        column.width += actual
        rest -= actual
      })

      // 还有未分配的尺寸（由于不处理精度问题，不用零判断），下一轮递归
      if (rest >= 1) {
        loop(rest, list)
      }
    }
    loop(rest, columns)
  }

  // 将 rest 尺寸作用到 columnss上
  _shrinkColumns(rest, columns) {
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, columns) => {
      // 找出能接纳收缩的 column
      const list = columns.filter(column => this._getShrinkSize(column) >= 1)
      if (!list.length) return

      // 均摊的尺寸
      const shrink = rest / list.length
      list.forEach(column => {
        // 实际收缩的尺寸
        const actual = Math.min(this._getShrinkSize(column), shrink)
        column.width -= actual
        rest -= actual
      })

      // 还有未分配的尺寸（由于不处理精度问题，不用零判断），下一轮递归
      if (rest >= 1) {
        loop(rest, list)
      }
    }
    loop(rest, columns)
  }

  // 更新内容排版画布的尺寸
  _updateCanvasWidth() {
    this.canvasWidth = this.getCanvasWidth()
  }

  _isFirstColumn(columnId) {
    // 检测入口
    let column = !this.shouldShowFixedColumns() || !this.hasFixedLeft()
      // 没固定列
      ? this.store.columns[0]
      // 首个固定列
      : this.store.columns.find(column => column.fixedLeft)

    // 检测是否第一列，或者第一子孙列
    while (column) {
      if (column.columnId === columnId) return true
      column = column.children?.[0]
    }
    return false
  }

  _isLastColumn(columnId) {
    // 检测入口
    let column = !this.shouldShowFixedColumns() || !this.hasFixedRight()
      // 没固定列
      ? this.store.columns[this.store.columns.length - 1]
      // 最后一个右固定列
      : findLast(this.store.columns, column => column.fixedRight)

    // 检测是否最后一列，或者最后的子孙列
    while (column) {
      if (column.columnId === columnId) return true
      const children = column.children
      if (!children) return false
      column = children[children.length - 1]
    }
    return false
  }

  _onEnterCell({ el, columnId }) {
    const rect = el.getBoundingClientRect()
    const relative = this.$mainHeader.getBoundingClientRect()
    // cell 左侧距离 header 左侧的距离
    const left = rect.left - relative.left
    const right = left + rect.width

    if (!this._isFirstColumn(columnId)) {
      this.resizeHandlerLeft = left - 3
    }

    if (!this._isLastColumn(columnId)) {
      this.resizeHandlerRight = right - 3
    }
  }

  _onLeaveCell({ to }) {
    if (!to?.classList?.contains?.('VGrid_resize_handler')) {
      this.resizeHandlerLeft = -5
      this.resizeHandlerRight = -5
    }
  }

  _onResizeMove(event) {
    const isLeft = this.resizehandler.classList.contains('VGrid_resize_handler-left')
    if (isLeft) {
      this.resizeHandlerLeft = event.pageX - this.resizeStartOffset
    }
    else {
      this.resizeHandlerRight = event.pageX - this.resizeStartOffset
    }
  }

  _onResizeEnd(event) {
    removeEventListener('mousemove', this._onResizeMove)
    removeEventListener('mouseup', this._onResizeEnd)
    const isLeft = this.resizehandler.classList.contains('VGrid_resize_handler-left')
    this.$el.classList.remove('VGrid-resizing')
    this.resizehandler.classList.remove('VGrid_resize_handler-resizing')
    this.resizehandler = null
    if (isLeft) {
      this.resizeHandlerLeft = event.pageX - this.resizeStartOffset
    }
    else {
      this.resizeHandlerRight = event.pageX - this.resizeStartOffset
    }
  }

  _onResizeStart(event) {
    addEventListener('mouseup', this._onResizeEnd)
    addEventListener('mousemove', this._onResizeMove)
    this.resizehandler = event.target
    const isLeft = this.resizehandler.classList.contains('VGrid_resize_handler-left')
    this.$el.classList.add('VGrid-resizing')
    this.resizehandler.classList.add('VGrid_resize_handler-resizing')
    this.resizeStartOffset = event.pageX - (isLeft ? this.resizeHandlerLeft : this.resizeHandlerRight)
  }

}

if (!customElements.get('bl-table')) {
  customElements.define('bl-table', BlocksTable)
}
