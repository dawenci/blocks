import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import type { RowColumn } from './RowColumn.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { setStyles } from '../../common/style.js'
import { style } from './header.style.js'
import { template } from './header-template.js'
import { BlTable } from './table.js'
import { BlComponent } from '../component/Component.js'

export type CellElement = HTMLElement & { column: RowColumn }

export interface TableHeaderEventMap extends BlComponentEventMap {
  'enter-cell': CustomEvent<{ $cell: CellElement; column: RowColumn }>
  sort: CustomEvent<{ column: RowColumn }>
}

export interface BlTableHeader extends BlComponent {
  $host: BlTable
  $viewport: HTMLElement
  $canvas: HTMLElement

  addEventListener<K extends keyof TableHeaderEventMap>(
    type: K,
    listener: BlComponentEventListener<TableHeaderEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof TableHeaderEventMap>(
    type: K,
    listener: BlComponentEventListener<TableHeaderEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-table-header',
  styles: [style],
})
export class BlTableHeader extends BlComponent {
  static override get role() {
    return 'rowgroup'
  }

  @attr('boolean') accessor border!: boolean

  _columns: RowColumn[] = []
  fixedLeftColumns: RowColumn[] = []
  fixedRightColumns: RowColumn[] = []

  constructor() {
    super()
    const { comTemplate } = template()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))

    const $viewport = shadowRoot.querySelector('#viewport') as HTMLElement
    const $canvas = shadowRoot.querySelector('.columns') as HTMLElement

    this.$viewport = $viewport
    this.$canvas = $canvas

    this._initHoverEvent()

    $canvas.onclick = (e: MouseEvent) => {
      let $el = e.target as CellElement | null
      while ($el && $el !== $canvas) {
        if ($el.classList.contains('sortable')) {
          const column = $el.column
          switch (column.sortOrder) {
            case 'none': {
              column.sortOrder = 'ascending'
              break
            }
            case 'ascending': {
              column.sortOrder = 'descending'
              break
            }
            case 'descending': {
              column.sortOrder = 'none'
              break
            }
          }

          this.$host!.getLeafColumnsWith().forEach(col => {
            if (col.sortOrder && col !== column) {
              col.sortOrder = 'none'
            }
          })
          this.render()
          dispatchEvent<{ column: RowColumn }>(this, 'sort', {
            detail: { column },
          })
          break
        }
        $el = $el.parentElement as CellElement | null
      }
    }
  }

  get columns() {
    return this._columns
  }

  set columns(value: RowColumn[]) {
    this._columns = value
    this.render()
  }

  get viewportScrollLeft() {
    return this.$viewport.scrollLeft
  }

  set viewportScrollLeft(value) {
    this.$viewport.scrollLeft = value
  }

  _initHoverEvent() {
    this.$canvas.addEventListener('mouseover', e => {
      let $cell = e.target as CellElement | null
      let _$cell!: HTMLElement & { column: RowColumn }
      while ($cell && $cell !== this.$canvas) {
        if ($cell.classList.contains('cell')) {
          if ($cell === _$cell) return
          _$cell = $cell
          dispatchEvent<{ $cell: CellElement; column: RowColumn }>(this, 'enter-cell', {
            detail: {
              $cell,
              column: $cell.column,
            },
          })
          return
        }
        $cell = $cell.parentElement as CellElement | null
      }
    })
  }

  widthSum(column: RowColumn, value = 0) {
    if (column.children.length) {
      column.children.forEach(child => this.widthSum(child, value))
    } else {
      value += column.width
    }
    return value
  }

  getFixedOffsetLeft(column: RowColumn) {
    let value = 0
    for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
      if (this.fixedLeftColumns[i] === column) return value
      value = this.widthSum(this.fixedLeftColumns[i], value)
    }
    return value
  }

  getFixedOffsetRight(column: RowColumn) {
    let value = 0
    for (let i = 0; i < this.fixedRightColumns.length; i += 1) {
      if (this.fixedRightColumns[i] === column) return value
      value = this.widthSum(this.fixedRightColumns[i], value)
    }
    return value
  }

  override render() {
    super.render()
    const columns = this.$host?.columns ?? []
    this.fixedLeftColumns = columns.filter(column => column.fixedLeft)
    this.fixedRightColumns = columns.filter(column => column.fixedRight).reverse()

    const render = (column: RowColumn, $wrap: HTMLElement) => {
      const { columnWidth, minWidth, maxWidth, align } = column
      const hasChildren = !!column.children.length
      const style: Record<string, any> = {}
      const cellStyle: Record<string, any> = {}
      if (!hasChildren) {
        style.width = (columnWidth ?? 80) + 'px'
        if (minWidth) style.minWidth = minWidth + 'px'
        if (maxWidth && maxWidth !== Infinity) style.maxWidth = maxWidth + 'px'
      }
      if (align) {
        cellStyle.textAlign = align
      }

      // 渲染自定义模板 OR 渲染 label
      let $content = column.headRender(column)
      if (!($content instanceof Node)) {
        $content = document.createTextNode($content ?? '')
      }

      const { cellTemplate } = template()
      const $cell = cellTemplate.cloneNode(true) as CellElement
      const $cellInner = $cell.firstElementChild as HTMLElement
      $cellInner.innerHTML = ''
      $cellInner.appendChild($content)

      if (!column.children?.length && column.sortOrder != null) {
        $cell.classList.add('sortable')
        if (!$cell.querySelector('.sort')) {
          const $sort = $cell.appendChild(document.createElement('div'))
          $sort.className = `sort ${column.sortOrder}`
        }
      } else {
        $cell.classList.remove('sortable')
        const $sort = $cell.querySelector('.sort')
        if ($sort) {
          $cell.removeChild($sort)
        }
      }

      $cell.column = column

      setStyles($cell, {
        width: column.width + 'px',
        minWidth: column.minWidth + 'px',
        maxWidth: column.maxWidth + 'px',
      })
      setStyles($cellInner, {
        textAlign: column.align,
      })

      const styles: Record<string, any> = {}
      if (this.fixedLeftColumns.includes(column)) {
        styles.position = 'sticky'
        styles.left = this.getFixedOffsetLeft(column) + 'px'
        styles.zIndex = '1'
      } else if (this.fixedRightColumns.includes(column)) {
        styles.position = 'sticky'
        styles.right = this.getFixedOffsetRight(column) + 'px'
        styles.zIndex = '1'
      } else {
        styles.position = ''
        styles.zIndex = ''
      }

      // 嵌套表头
      if (hasChildren) {
        const { groupTemplate } = template()
        const $group = groupTemplate.cloneNode(true) as HTMLElement
        $group.querySelector('.group_label')!.appendChild($cell)
        $cell.style.width = ''

        const $children = $group.querySelector('.columns') as HTMLElement
        column.children.forEach(child => {
          render(child, $children)
        })

        setStyles($group, styles)
        $wrap.appendChild($group)
      } else {
        setStyles($cell, styles)
        $wrap.appendChild($cell)
      }
    }

    this.$canvas.innerHTML = ''
    columns.forEach(column => render(column, this.$canvas))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.upgradeProperty(['area', 'columns'])
  }
}
