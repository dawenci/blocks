import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { make, RowColumn } from './RowColumn.js'
import '../scrollable/index.js'
import './header.js'
import './body.js'
import { setStyles } from '../../common/style.js'
import { onDragMove } from '../../common/onDragMove.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'
import { template } from './table-template.js'
import { BlocksTableHeader, CellElement as HeaderCell } from './header.js'
import { BlocksTableBody, CellElement } from './body.js'
import { VirtualItem } from '../vlist/index.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

let gridId = 0

type EnterCellEvent = {
  $cell: CellElement
  column: RowColumn
}

type ResizeHandler = HTMLElement & { $cell: HeaderCell; column: RowColumn }

export interface BlocksTableEventMap extends ComponentEventMap {
  layout: CustomEvent
}

export interface BlocksTable extends Component {
  _ref: {
    $mainHeader: BlocksTableHeader
    $mainBody: BlocksTableBody
    $resizeHandle: ResizeHandler
    $fixedLeftShadow?: HTMLElement
    $fixedRightShadow?: HTMLElement
  }
  addEventListener<K extends keyof BlocksTableEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksTableEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof BlocksTableEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksTableEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@customElement('bl-table')
export class BlocksTable extends Component {
  _data: any
  _columns: RowColumn[] = []
  width?: number
  disableActiveMethod?: (vitem: VirtualItem) => boolean
  shouldShowFixedColumns?: () => boolean

  static override get observedAttributes() {
    return ['border']
  }

  @attr('boolean') accessor border!: boolean

  constructor() {
    super()

    const { cssTemplate } = template()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(cssTemplate.cloneNode(true))

    // 表头
    const $mainHeader = shadowRoot.appendChild(
      document.createElement('bl-table-header')
    ) as BlocksTableHeader
    $mainHeader.$host = this

    // 表身
    const $mainBody = shadowRoot.appendChild(
      document.createElement('bl-table-body')
    ) as BlocksTableBody
    $mainBody.$host = this

    // 列宽拖拽柄
    const $resizeHandle = shadowRoot.appendChild(
      document.createElement('div')
    ) as unknown as ResizeHandler
    $resizeHandle.id = 'resize-handle'

    // 水平滚动，同步 header 的左右滚动
    $mainBody.addEventListener('bl:scroll', () => {
      $mainHeader.viewportScrollLeft = $mainBody.getScrollCross()
    })

    // 如果存在固定列，渲染投影
    $mainBody.addEventListener('bl:change:can-scroll-left', () => {
      this._updateFiexedColumnShadow()
    })
    $mainBody.addEventListener('bl:change:can-scroll-right', () => {
      this._updateFiexedColumnShadow()
    })

    // hover header 渲染拖拽柄
    $mainHeader.addEventListener('enter-cell', e => {
      const { $cell, column } = e.detail
      // 只允许拖拽调整末级列
      if (
        column.resizable &&
        !column.children?.length &&
        !this.classList.contains('resizing')
      ) {
        $resizeHandle.$cell = $cell
        $resizeHandle.column = column
        setStyles($resizeHandle, {
          height: $cell.offsetHeight + 'px',
          left:
            $cell.offsetLeft +
            $cell.clientWidth -
            $mainHeader.viewportScrollLeft -
            3 +
            'px',
          top: $cell.offsetTop + 'px',
        })
      }
    })

    $mainHeader.addEventListener('sort', (e: any) => {
      const column = e.detail.column
      $mainBody.sortField = column.prop
      $mainBody.sortOrder = column.sortOrder
    })

    this._ref = {
      $mainHeader,
      $mainBody,
      $resizeHandle,
    }

    this._initResizeEvent()
  }

  get data() {
    return this._data ?? []
  }

  set data(value) {
    this._data = value
    this._ref.$mainBody.data = value
  }

  get columns() {
    return this._columns ?? []
  }

  set columns(value) {
    this._columns = (value ?? []).map((options: Partial<RowColumn>) =>
      make(options)
    )
    this._ref.$mainHeader.columns = value
    this._ref.$mainBody.columns = value
    this._updateFiexedColumnShadow()
  }

  // 数据排序方法
  // @Prop({ type: Function }) sortMethod?: (a: any, b: any) => number

  // 数据禁止切换激活的检查方法
  // @Prop({ type: Function, default: () => false })
  // disableActiveMethod

  // 当前的激活行
  activeRow: VirtualItem | null = null

  resizeHandlerLeft = -5

  resizeHandlerRight = -5

  // 当前实例是否 VGrid
  gridId = ++gridId

  resizehandler = null

  resizeStartOffset = 0

  _updateFiexedColumnShadow() {
    const { $mainBody } = this._ref
    const leftSize = $mainBody.getFixedLeftShadowPosition()
    const rightSize = $mainBody.getFixedRightShadowPosition()

    if (leftSize && $mainBody._ref.$viewport.canScrollLeft) {
      if (!this._ref.$fixedLeftShadow) {
        this._ref.$fixedLeftShadow = document.createElement('div')
        this._ref.$fixedLeftShadow.id = 'fixed-left-shadow'
      }
      if (!this._ref.$fixedLeftShadow.parentNode) {
        this.shadowRoot!.appendChild(this._ref.$fixedLeftShadow)
      }
      this._ref.$fixedLeftShadow.style.left = leftSize - 1 + 'px'
    } else {
      if (this._ref.$fixedLeftShadow) {
        if (this._ref.$fixedLeftShadow.parentNode) {
          this.shadowRoot!.removeChild(this._ref.$fixedLeftShadow)
        }
      }
    }

    if (rightSize && $mainBody._ref.$viewport.canScrollRight) {
      if (!this._ref.$fixedRightShadow) {
        this._ref.$fixedRightShadow = document.createElement('div')
        this._ref.$fixedRightShadow.id = 'fixed-right-shadow'
      }
      if (!this._ref.$fixedRightShadow.parentNode) {
        this.shadowRoot!.appendChild(this._ref.$fixedRightShadow)
      }
      this._ref.$fixedRightShadow.style.right = rightSize + 'px'
    } else {
      if (this._ref.$fixedRightShadow) {
        if (this._ref.$fixedRightShadow.parentNode) {
          this.shadowRoot!.removeChild(this._ref.$fixedRightShadow)
        }
      }
    }

    this.style.minWidth = leftSize + rightSize + 80 + 'px'
  }

  override render() {
    this._ref.$mainHeader.render()
    this._ref.$mainBody.render()
  }

  _clearResizeHandler?: () => void
  override connectedCallback() {
    super.connectedCallback()
    this.upgradeProperty(['columns', 'data'])

    this._clearResizeHandler = sizeObserve(this, () => {
      this.layout(this.getCanvasWidth())
      this.render()
      // 刷新投影座标
      this._updateFiexedColumnShadow()
    })
  }

  override disconnectedCallback() {
    if (this._clearResizeHandler) {
      this._clearResizeHandler()
    }
  }

  // 获取（可选过滤条件的）末级列
  getLeafColumnsWith(pred?: (column: any, parentColumn: any) => boolean) {
    const columns: any[] = []

    const flat = (column: any, parentColumn: any) => {
      if (pred && !pred(column, parentColumn)) return
      if (column?.children?.length) {
        column.children.forEach((child: any) => flat(child, column))
      }
      // leaf
      else {
        columns.push(column)
      }
    }
    this.columns.forEach((child: any) => flat(child, null))
    return columns
  }

  // 获取所有固定末级列
  // undefined | 'left' | 'right'
  getFixedLeafColumns(area: 'left' | 'right') {
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
    return this.getFixedLeafColumns('left').reduce(
      (acc, column) => acc + column.width,
      0
    )
  }

  // 计算右固定列的宽度
  fixedRightWidth() {
    return this.getFixedLeafColumns('right').reduce(
      (acc, column) => acc + column.width,
      0
    )
  }

  // 计算用于内容排版的画布尺寸
  // @Provide()
  getCanvasWidth() {
    const columnsMinWidth = this.getLeafColumnsWith().reduce(
      (acc, column) => acc + column.minWidth,
      0
    )
    const bodyWidth = this._ref.$mainBody?.clientWidth ?? this.width ?? 400
    return Math.max(bodyWidth, columnsMinWidth)
  }

  // 进行布局，调整各列的宽度以适配排版容器
  layout(canvasWidth: number) {
    this._ref.$mainHeader._ref.$canvas.style.width = canvasWidth + 'px'
    this._ref.$mainBody.crossSize = canvasWidth

    // 已分配的宽度
    const sum = this.getLeafColumnsWith().reduce(
      (acc, column) => acc + column.width,
      0
    )

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
  active(rowKey: string) {
    const row = this._ref.$mainBody.getVirtualItemByKey(rowKey)

    // 目标行不存在，则清除当前激活行后退出
    if (!row) {
      if (this.activeRow) {
        ;(this.activeRow as any).active = false
      }
      this.activeRow = null
      return
    }

    // 目标行不允许激活，直接退出
    if (this.disableActiveMethod && this.disableActiveMethod(row)) {
      return
    }

    // 切换激活行
    if (this.activeRow && row !== this.activeRow) {
      ;(this.activeRow as any).active = false
    }
    ;(row as any).active = true
    this.activeRow = row
  }

  // 获取面板允许扩张的尺寸
  _getGrowSize(column: RowColumn) {
    if (column.resizable) return 0
    const size = column.maxWidth - column.width
    if (size > 0) return size
    return 0
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize(column: RowColumn) {
    if (column.resizable) return 0
    const size = column.width - column.minWidth
    if (size > 0) return size
    return 0
  }

  // 将 rest 尺寸分配到 columns 上
  _expandColumns(rest: number, columns: RowColumn[]) {
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, columns: RowColumn[]) => {
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
  _shrinkColumns(rest: number, columns: RowColumn[]) {
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, columns: RowColumn[]) => {
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

  // _isFirstColumn(columnId: string) {
  //   // 检测入口
  //   let column =
  //     !this.shouldShowFixedColumns?.() || !this.hasFixedLeft()
  //       ? // 没固定列
  //         this.store.columns[0]
  //       : // 首个固定列
  //         this.store.columns.find(column => column.fixedLeft)

  //   // 检测是否第一列，或者第一子孙列
  //   while (column) {
  //     if (column.columnId === columnId) return true
  //     column = column.children?.[0]
  //   }
  //   return false
  // }

  // _isLastColumn(columnId: string) {
  //   // 检测入口
  //   let column =
  //     !this.shouldShowFixedColumns?.() || !this.hasFixedRight()
  //       ? // 没固定列
  //         this.store.columns[this.store.columns.length - 1]
  //       : // 最后一个右固定列
  //         findLast(this.store.columns, column => column.fixedRight)

  //   // 检测是否最后一列，或者最后的子孙列
  //   while (column) {
  //     if (column.columnId === columnId) return true
  //     const children = column.children
  //     if (!children) return false
  //     column = children[children.length - 1]
  //   }
  //   return false
  // }

  _initResizeEvent() {
    let startX: number
    let column: RowColumn
    let $cell: HTMLElement & { column: RowColumn }

    const update = (offset: { x: number }) => {
      let newX = startX + offset.x
      if (offset.x < 0) {
        if (column.width + offset.x < column.minWidth) {
          newX = startX - (column.width - column.minWidth)
        }
      } else {
        if (column.width + offset.x > column.maxWidth) {
          newX = startX - (column.width - column.maxWidth)
        }
      }
      return newX
    }

    onDragMove(this._ref.$resizeHandle, {
      onStart: () => {
        this.classList.add('resizing')
        startX = parseInt(this._ref.$resizeHandle.style.left, 10)
        column = this._ref.$resizeHandle.column
        $cell = this._ref.$resizeHandle.$cell
      },

      onMove: ({ offset }) => {
        const newX = update(offset)
        this._ref.$resizeHandle.style.left = newX + 'px'
      },

      onEnd: ({ offset }) => {
        this.classList.remove('resizing')
        const newX = update(offset)
        const offsetX = newX - startX
        if (offsetX !== 0) {
          column.width += offsetX
          this._ref.$mainHeader.render()
          this._ref.$mainBody._resetCalculated()
          this._ref.$mainBody.redraw()
        }
      },

      onCancel: () => {
        this.classList.remove('resizing')
      },
    })
  }
}
