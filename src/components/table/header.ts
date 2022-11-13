import { dispatchEvent } from '../../common/event.js'
import { setStyles } from '../../common/style.js'
import { Component } from '../Component.js'
import { template } from './header-template.js'
import { RowColumn } from './RowColumn.js'
import { BlocksTable } from './table.js'

export type CellElement = HTMLElement & { column: RowColumn }

export interface TableHeaderEventMap {
  'enter-cell': CustomEvent<{ $cell: CellElement; column: RowColumn }>
  sort: CustomEvent<{ column: RowColumn }>
}

export interface BlocksTableHeader extends Component {
  _ref: {
    $host?: BlocksTable
    $viewport: HTMLElement
    $canvas: HTMLElement
  }
}

export class BlocksTableHeader extends Component {
  _columns: RowColumn[] = []
  fixedLeftColumns: RowColumn[] = []
  fixedRightColumns: RowColumn[] = []

  constructor() {
    super()
    const { cssTemplate, comTemplate } = template()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))

    const $viewport = shadowRoot.querySelector('#viewport') as HTMLElement
    const $canvas = shadowRoot.querySelector('.columns') as HTMLElement

    this._ref = {
      $viewport,
      $canvas,
    }

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

  get $host() {
    return this._ref.$host
  }

  set $host(table: BlocksTable | undefined) {
    this._ref.$host = table
  }

  get columns() {
    return this._columns
  }

  set columns(value: RowColumn[]) {
    this._columns = value
    this.render()
  }

  get viewportScrollLeft() {
    return this._ref.$viewport.scrollLeft
  }

  set viewportScrollLeft(value) {
    this._ref.$viewport.scrollLeft = value
  }

  _initHoverEvent() {
    this._ref.$canvas.addEventListener('mouseover', e => {
      let $cell = e.target as CellElement | null
      let _$cell!: HTMLElement & { column: RowColumn }
      while ($cell && $cell !== this._ref.$canvas) {
        if ($cell.classList.contains('cell')) {
          if ($cell === _$cell) return
          _$cell = $cell
          dispatchEvent<{ $cell: CellElement; column: RowColumn }>(
            this,
            'enter-cell',
            {
              detail: {
                $cell,
                column: $cell.column,
              },
            }
          )
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
    const columns = this.$host?.columns ?? []
    this.fixedLeftColumns = columns.filter(column => column.fixedLeft)
    this.fixedRightColumns = columns
      .filter(column => column.fixedRight)
      .reverse()

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

    this._ref.$canvas.innerHTML = ''
    columns.forEach(column => render(column, this._ref.$canvas))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.upgradeProperty(['area', 'columns'])
  }

  override addEventListener<K extends keyof TableHeaderEventMap>(
    type: K,
    listener: (this: this, ev: TableHeaderEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  override addEventListener(
    type: string,
    listener: (this: this, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  override addEventListener(
    type: any,
    listener: (this: this, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options)
  }

  static override get observedAttributes() {
    return []
  }
}

if (!customElements.get('bl-table-header')) {
  customElements.define('bl-table-header', BlocksTableHeader)
}
