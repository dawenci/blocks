import type { BlTableBody, CellElement } from './body.js'
import type { BlTableHeader, CellElement as HeaderCell } from './header.js'
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import type { RowColumn } from './RowColumn.js'
import type { VirtualItem } from '../vlist/index.js'
import './body.js'
import './header.js'
import '../scrollable/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { make } from './RowColumn.js'
import { onDragMove } from '../../common/onDragMove.js'
import { prop } from '../../decorators/prop/index.js'
import { setStyles } from '../../common/style.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { style } from './table.style.js'
import { BlComponent } from '../component/Component.js'

// let gridId = 0

type EnterCellEvent = {
  $cell: CellElement
  column: RowColumn
}

type ResizeHandler = HTMLElement & { $cell: HeaderCell; column: RowColumn }

export interface BlTableEventMap extends BlComponentEventMap {
  layout: CustomEvent
}

export interface BlTable extends BlComponent {
  $fixedLeftShadow?: HTMLElement
  $fixedRightShadow?: HTMLElement

  addEventListener<K extends keyof BlTableEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTableEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof BlTableEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTableEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO: 数据排序方法
// TODO: 数据禁止切换激活的检查方法
@defineClass({
  customElement: 'bl-table',
  styles: [style],
})
export class BlTable extends BlComponent {
  static override get role() {
    return 'table'
  }

  _data: any
  _columns: RowColumn[] = []
  width?: number
  disableActiveMethod?: (vitem: VirtualItem) => boolean
  shouldShowFixedColumns?: () => boolean

  @attr('boolean') accessor border!: boolean

  // columns 先于 data 定义（确保 upgrade 时先 upgrade columns）
  @prop({
    get(self) {
      return self._columns ?? []
    },
    set(self, value) {
      self._columns = (value ?? []).map((options: Partial<RowColumn>) => make(options))
      self.$mainHeader.columns = value
      self.$mainBody.columns = value
      self.render()
    },
  })
  accessor columns!: RowColumn[]

  @prop({
    get(self) {
      return self._data ?? []
    },
    set(self, value) {
      self._data = value
      self.$mainBody.data = value
    },
  })
  accessor data!: any[]

  @shadowRef('bl-table-header') accessor $mainHeader!: BlTableHeader
  @shadowRef('bl-table-body') accessor $mainBody!: BlTableBody
  @shadowRef('#resize-handle') accessor $resizeHandle!: ResizeHandler

  constructor() {
    super()

    // 表头
    this.#setupHeader()

    // 表身
    this.#setupBody()

    // 列宽拖拽柄
    this.#setupResize()

    this.#setupFixedColumnShadow()
  }

  // 当前的激活行
  activeRow: VirtualItem | null = null

  resizeHandlerLeft = -5

  resizeHandlerRight = -5

  // gridId = ++gridId

  resizehandler = null

  resizeStartOffset = 0

  #setupHeader() {
    const $mainHeader = document.createElement('bl-table-header') as BlTableHeader
    $mainHeader.$host = this
    this.appendShadowChild($mainHeader)

    this.$mainHeader.addEventListener('sort', (e: any) => {
      const column = e.detail.column
      this.$mainBody.sortField = column.prop
      this.$mainBody.sortOrder = column.sortOrder
    })

    const updateHeader = () => this.$mainHeader.render()
    this.hook.onRender(updateHeader)

    const updateBorder = () => {
      this.$mainHeader.border = this.border
    }
    this.hook.onRender(updateBorder)
    this.hook.onAttributeChangedDep('border', updateBorder)
    this.hook.onConnected(updateBorder)
  }

  #setupBody() {
    const $mainBody = document.createElement('bl-table-body') as BlTableBody
    $mainBody.$host = this
    this.appendShadowChild($mainBody)

    // 水平滚动，同步 header 的左右滚动
    this.$mainBody.addEventListener('bl:scroll', () => {
      this.$mainHeader.viewportScrollLeft = $mainBody.getScrollCross()
    })

    this.hook.onRender(() => {
      this.$mainBody.render()
    })

    const updateBorder = () => {
      this.$mainBody.border = this.border
    }
    this.hook.onRender(updateBorder)
    this.hook.onAttributeChangedDep('border', updateBorder)
    this.hook.onConnected(updateBorder)
  }

  #setupResize() {
    const $resizeHandle = document.createElement('div') as unknown as ResizeHandler
    $resizeHandle.id = 'resize-handle'
    this.appendShadowChild($resizeHandle)

    // hover header 渲染拖拽柄
    this.$mainHeader.addEventListener('enter-cell', e => {
      const { $cell, column } = e.detail
      // 只允许拖拽调整末级列
      if (column.resizable && !column.children?.length && !this.classList.contains('resizing')) {
        this.$resizeHandle.$cell = $cell
        this.$resizeHandle.column = column
        setStyles(this.$resizeHandle, {
          height: $cell.offsetHeight + 'px',
          left: $cell.offsetLeft + $cell.clientWidth - this.$mainHeader.viewportScrollLeft - 3 + 'px',
          top: $cell.offsetTop + 'px',
        })
      }
    })

    const initEvent = () => {
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

      return onDragMove(this.$resizeHandle, {
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
          const offsetX = newX - startX
          if (offsetX !== 0) {
            column.width += offsetX
            this.$mainHeader.render()
            this.$mainBody._resetCalculated()
            this.$mainBody.redraw()
            dispatchEvent(this, 'column-resize')
          }
        },

        onCancel: () => {
          this.classList.remove('resizing')
        },
      })
    }
    let clear: () => void
    this.hook.onConnected(() => {
      clear = initEvent()
    })
    this.hook.onDisconnected(() => {
      if (clear) {
        clear()
      }
    })
  }

  #setupFixedColumnShadow() {
    const update = () => {
      const { $mainBody } = this
      const leftSize = $mainBody.getFixedLeftShadowPosition()
      const rightSize = $mainBody.getFixedRightShadowPosition()

      if (leftSize && $mainBody.$viewport.canScrollLeft) {
        if (!this.$fixedLeftShadow) {
          this.$fixedLeftShadow = document.createElement('div')
          this.$fixedLeftShadow.id = 'fixed-left-shadow'
        }
        if (!this.$fixedLeftShadow.parentNode) {
          this.shadowRoot!.appendChild(this.$fixedLeftShadow)
        }
        this.$fixedLeftShadow.style.left = leftSize - 1 + 'px'
      } else {
        if (this.$fixedLeftShadow) {
          if (this.$fixedLeftShadow.parentNode) {
            this.shadowRoot!.removeChild(this.$fixedLeftShadow)
          }
        }
      }

      if (rightSize && $mainBody.$viewport.canScrollRight) {
        if (!this.$fixedRightShadow) {
          this.$fixedRightShadow = document.createElement('div')
          this.$fixedRightShadow.id = 'fixed-right-shadow'
        }
        if (!this.$fixedRightShadow.parentNode) {
          this.shadowRoot!.appendChild(this.$fixedRightShadow)
        }
        this.$fixedRightShadow.style.right = rightSize + 'px'
      } else {
        if (this.$fixedRightShadow) {
          if (this.$fixedRightShadow.parentNode) {
            this.shadowRoot!.removeChild(this.$fixedRightShadow)
          }
        }
      }

      this.style.minWidth = leftSize + rightSize + 80 + 'px'
    }

    // 如果存在固定列，渲染投影
    this.$mainBody.addEventListener('bl:change:can-scroll-left', () => {
      update()
    })
    this.$mainBody.addEventListener('bl:change:can-scroll-right', () => {
      update()
    })
    this.addEventListener('column-resize', () => {
      update()
    })

    let stopObserve: () => void
    this.hook.onConnected(() => {
      stopObserve = sizeObserve(this, () => {
        this.layout(this.getCanvasWidth())
        this.render()
        update()
      })
    })
    this.hook.onDisconnected(() => {
      if (stopObserve) {
        stopObserve()
      }
    })
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
    return this.getFixedLeafColumns('left').reduce((acc, column) => acc + column.width, 0)
  }

  // 计算右固定列的宽度
  fixedRightWidth() {
    return this.getFixedLeafColumns('right').reduce((acc, column) => acc + column.width, 0)
  }

  // 计算用于内容排版的画布尺寸
  // @Provide()
  getCanvasWidth() {
    const columnsMinWidth = this.getLeafColumnsWith().reduce((acc, column) => acc + column.minWidth, 0)
    const bodyWidth = this.$mainBody?.clientWidth ?? this.width ?? 400
    return Math.max(bodyWidth, columnsMinWidth)
  }

  // 进行布局，调整各列的宽度以适配排版容器
  layout(canvasWidth: number) {
    this.$mainHeader.$canvas.style.width = canvasWidth + 'px'
    this.$mainBody.crossSize = canvasWidth

    // 已分配的宽度
    const sum = this.getLeafColumnsWith().reduce((acc, column) => acc + column.width, 0)

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
    const row = this.$mainBody.getVirtualItemByKey(rowKey)

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
}
