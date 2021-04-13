import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import RowColumn from './RowColumn.js'
import '../scrollable/index.js'
import './header.js'
import './body.js'

import { __border_color_light, __color_danger_light, __color_primary_light } from '../../theme/var.js'
import { setStyles } from '../../common/style.js'
import { onDragMove } from '../../common/onDragMove.js'

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

#fixed-left-shadow,
#fixed-right-shadow {
  position: absolute;
  top: 0;
  bottom: 6px;
  width: 5px;
  pointer-events: none;
}
#fixed-left-shadow {
  border-left: 1px solid var(--border-color-light, ${__border_color_light});
  background-image: linear-gradient(to right, rgba(0,0,0,.1), rgba(0,0,0,.0))
}
#fixed-right-shadow {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
  background-image: linear-gradient(to left, rgba(0,0,0,.1), rgba(0,0,0,.0))
}

/* 列宽调整柄 */
#resize-handle {
  position: absolute;
  z-index: 2;
  top: 0;
  right: auto;
  bottom: auto;
  left: -6px;
  width: 6px;
  user-select: none;
  cursor: col-resize;
}
#resize-handle::before,
#resize-handle::after {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
#resize-handle::before {
  width: 100%;
  height: 100%;
}
#resize-handle::after {
  width: 1px;
  height: 100%;
}
#resize-handle:hover::before,
:host(.resizing) #resize-handle::before {
  background-color: var(--color-primary-light, ${__color_primary_light});
  opacity: .5;
}
#resize-handle:hover::after,
:host(.resizing) #resize-handle::after {
  background-color: var(--color-primary-light, ${__color_primary_light});
}
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

  // 数据排序方法
  // @Prop({ type: Function }) sortMethod?: (a: any, b: any) => number

  // 数据禁止切换激活的检查方法
  // @Prop({ type: Function, default: () => false })
  // disableActiveMethod

  // 当前的激活行
  activeRow = null

  resizeHandlerLeft = -5

  resizeHandlerRight = -5

  // 当前实例是否 VGrid
  gridId = ++gridId

  resizehandler = null

  resizeStartOffset = 0

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))

    // 表头
    this.$mainHeader = shadowRoot.appendChild(document.createElement('bl-table-header'))
    this.$mainHeader.$host = this

    // 表身
    this.$mainBody = shadowRoot.appendChild(document.createElement('bl-table-body'))
    this.$mainBody.$host = this

    // 列宽拖拽柄
    this.$resizeHandle = shadowRoot.appendChild(document.createElement('div'))
    this.$resizeHandle.id = 'resize-handle'

    // 水平滚动，同步 header 的左右滚动
    this.$mainBody.onscroll = e => {
      this.$mainHeader.scrollLeft = this.$mainBody.getScrollCross()
    }

    // 如果存在固定列，渲染投影
    this.$mainBody.addEventListener('can-scroll-left-change', () => {
      this._updateFiexedColumnShadow()
    })
    this.$mainBody.addEventListener('can-scroll-right-change', () => {
      this._updateFiexedColumnShadow()
    })

    // hover header 渲染拖拽柄
    this.$mainHeader.addEventListener('enter-cell', e => {
      const { $cell, column } = e.detail
      // 只允许拖拽调整末级列
      if (column.resizable && !column.children?.length && !this.classList.contains('resizing')) {
        this.$resizeHandle.$cell = $cell
        this.$resizeHandle.column = column
        setStyles(this.$resizeHandle, {
          height: $cell.offsetHeight + 'px',
          left: $cell.offsetLeft + $cell.clientWidth - this.$mainHeader.scrollLeft - 3 + 'px',
          top: $cell.offsetTop + 'px',
        })
      }
    })

    this.$mainHeader.addEventListener('sort', e => {
      const column = e.detail.column
      this.$mainBody.sortField = column.prop
      this.$mainBody.sortOrder = column.sortOrder
    })

    this._initResizeEvent()
  }

  _updateFiexedColumnShadow() {
    const leftSize = this.$mainBody.getFixedLeftShadowPosition()
    const rightSize = this.$mainBody.getFixedRightShadowPosition()

    if (leftSize && this.$mainBody.$viewport.canScrollLeft) {
      if (!this.$fixedLeftShadow) {
        this.$fixedLeftShadow = document.createElement('div')
        this.$fixedLeftShadow.id = 'fixed-left-shadow'
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
        this.$fixedRightShadow.id = 'fixed-right-shadow'
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

  // 获取（可选过滤条件的）末级列
  getLeafColumnsWith(pred) {
    const columns = []
    const flat = (column, parentColumn) => {
      if (pred && !pred(column, parentColumn)) return
      if (column?.children?.length) {
        column.children.forEach(child => flat(child, column))
      }
      // leaf
      else {
        columns.push(column)
      }
    }
    this.columns.forEach(child => flat(child, null))
    return columns
  }

  // 获取所有固定末级列
  // undefined | 'left' | 'right'
  getFixedLeafColumns(area) {
    if (area === 'left' || area === 'right') {
      const prop = area === 'left' ? 'fixedLeft' : 'fixedRight'
      return this.getLeafColumnsWith(column => {
        let col = column
        while (col) {
          if (col[prop]) return true
          col = col.parent
        }
        return false
      })
    }
    return this.getLeafColumnsWith(column => {
      let col = column
        while (col) {
          if (col.fixedLeft || col.fixedRight) return true
          col = col.parent
        }
        return false
    })
  }

  // 是否有左固定列
  hasFixedLeft() {
    return this.columns.some(column => !!column.fixedLeft)
  }

  // 是否有右固定列
  hasFixedRight() {
    return this.columns.some(column => !!column.fixedRight)
  }

  // 计算左固定列的宽度
  fixedLeftWidth() {
    return this.getFixedLeafColumns('left')
      .reduce((acc, column) => acc + column.width, 0)
  }

  // 计算右固定列的宽度
  fixedRightWidth() {
    return this.getFixedLeafColumns('right')
      .reduce((acc, column) => acc + column.width, 0)
  }

  
  // 计算用于内容排版的画布尺寸
  // @Provide()
  getCanvasWidth() {
    const columnsMinWidth = this.getLeafColumnsWith()
      .reduce((acc, column) => acc + column.minWidth, 0)
    const bodyWidth = this.$mainBody?.clientWidth ?? this.width ?? 400
    return Math.max(bodyWidth, columnsMinWidth)
  }

  // 进行布局，调整各列的宽度以适配排版容器
  layout(canvasWidth) {
    this.$mainHeader.$canvas.style.width = canvasWidth + 'px'
    this.$mainBody.crossSize = canvasWidth

    // 已分配的宽度
    const sum = this.getLeafColumnsWith()
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
      this._expandColumns(remainingWidth, this.getLeafColumnsWith())
      dispatchEvent(this, 'layout')
      return
    }

    // 未分配的尺寸小于 0，需要将这些收缩量分配到 column 上
    this._shrinkColumns(-remainingWidth, this.getLeafColumnsWith())

    dispatchEvent(this, 'layout')
  }

  // 激活某行
  active(rowKey) {
    const row = this.getVirtualItemByKey(rowKey)

    // 目标行不存在，则清除当前激活行后退出
    if (!row) {
      if (this.activeRow) this.activeRow.active = false
      this.activeRow = null
      return
    }

    // 目标行不允许激活，直接退出
    if (this.disableActiveMethod && this.disableActiveMethod(row)) {
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
    if (column.resizable) return 0
    const size = column.maxWidth - column.width
    if (size > 0) return size
    return 0
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize(column) {
    if (column.resizable) return 0
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

  _initResizeEvent() {
    let startX
    let column
    let $cell

    const update = offset => {
      let newX = startX + offset.x
      if (offset.x < 0) {
        if (column.width + offset.x < column.minWidth) {
          newX = startX - (column.width - column.minWidth)
        }
      }
      else {
        if (column.width + offset.x > column.maxWidth) {
          newX = startX - (column.width - column.maxWidth)
        }
      }
      return newX
    }

    onDragMove(this.$resizeHandle, {
      onStart: () => {
        this.classList.add('resizing')
        startX = parseInt(this.$resizeHandle.style.left, 10)
        column = this.$resizeHandle.column
        $cell = this.$resizeHandle.$cell
      },

      onMove: ({ offset }) => {
        const newX = update(offset)
        this.$resizeHandle.style.left = newX + 'px'
      },

      onEnd: ({ offset }) => {
        this.classList.remove('resizing')
        const newX = update(offset)
        const offsetX = (newX - startX)
        if (offsetX !== 0) {
          column.width += offsetX
          this.$mainHeader.render()
          this.$mainBody._resetCalculated()
          this.$mainBody.redraw()
        }
      },

      onCancel: () => {
        this.classList.remove('resizing')
      }      
    })
  }
}

if (!customElements.get('bl-table')) {
  customElements.define('bl-table', BlocksTable)
}
