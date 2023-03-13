import { BlocksVList, VListEventMap } from '../vlist/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { setStyles } from '../../common/style.js'
import { dispatchEvent } from '../../common/event.js'
import { template } from './body-template.js'
import { BlocksTable } from './table.js'
import { RowColumn } from './RowColumn.js'
import { ComponentEventListener } from '../Component.js'

export type CellElement = HTMLElement & { column: RowColumn; data: any }

export interface BlocksTableBodyEventMap extends VListEventMap {
  'click-cell': CustomEvent<{
    $el: CellElement
    column: RowColumn
  }>
  'click-row': CustomEvent<{ $el: HTMLElement; data: any }>
}

export interface BlocksTableBody extends BlocksVList {
  _ref: BlocksVList['_ref'] & {
    $host: BlocksTable
    $summary?: HTMLElement
  }

  addEventListener<K extends keyof BlocksTableBodyEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksTableBodyEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof BlocksTableBodyEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksTableBodyEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-table-body',
})
export class BlocksTableBody extends BlocksVList {
  static override get observedAttributes() {
    return BlocksVList.observedAttributes.concat(['sort-field', 'sort-order', 'summary-height'])
  }

  #sortFlag?: Promise<void>

  columns: RowColumn[] = []
  flattenColumns: RowColumn[] = []
  fixedLeftColumns: RowColumn[] = []
  fixedRightColumns: RowColumn[] = []

  @attr('string') accessor sortField!: string | null

  @attr('string') accessor sortOrder!: string | null

  @attr('int') accessor summaryHeight = 0

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    const { cssTemplate } = template()
    shadowRoot.appendChild(cssTemplate.cloneNode(true))

    this._ref.$list.onclick = this._onClick.bind(this)

    this.addEventListener('bl:scroll', () => {
      // 同步合计行的左右滚动
      if (this._ref.$summary) {
        this._ref.$summary.scrollLeft = this.getScrollCross()
      }
    })
  }

  get $host() {
    return this._ref.$host
  }

  set $host(table: BlocksTable) {
    this._ref.$host = table
  }

  get shouldRenderSummary() {
    return this.flattenColumns.some(column => typeof column.summaryRender === 'function')
  }

  override async sortMethod(data: any[]) {
    const column = this.flattenColumns.find(column => column.prop == this.sortField)
    if (!column || column.sortOrder === 'none') return data

    const $cell = document.createElement('div')
    data.sort((a, b) => {
      if (column.sortMethod) {
        const value = column.sortMethod(a.data, b.data)
        return value * (column.sortOrder === 'ascending' ? 1 : -1)
      }
      // 如果没有自定义排序方法，则默认以字符串的字典序排列
      const labelA = column.render(a.data, column, $cell)
      const labelB = column.render(b.data, column, $cell)
      const va = labelA instanceof Node ? labelA.textContent : labelA
      const vb = labelB instanceof Node ? labelB.textContent : labelB
      return va!.localeCompare(vb!) * (column.sortOrder === 'ascending' ? 1 : -1)
    })
    return data
  }

  override beforeRender() {
    this.flattenColumns = this.$host.getLeafColumnsWith()
    this.fixedLeftColumns = this.$host.getFixedLeafColumns('left')
    this.fixedRightColumns = this.$host.getFixedLeafColumns('right').reverse()
  }

  override afterRender() {
    this._renderSummaryRow()
  }

  override itemRender($item: any, vitem: any) {
    $item.data = vitem.data
    $item.classList.add('row')
    $item.classList.toggle('row-even', vitem.virtualViewIndex % 2 === 0)
    $item.classList.toggle('row-odd', vitem.virtualViewIndex % 2 !== 0)

    while ($item.children.length > this.flattenColumns.length) {
      $item.removeChild($item.lastElementChild)
    }

    const { cellTemplate } = template()
    while ($item.children.length < this.flattenColumns.length) {
      $item.appendChild(cellTemplate.cloneNode(true))
    }

    this.flattenColumns.forEach((column, index) => {
      const $cell = $item.children[index]
      const $cellInner = $cell.firstElementChild
      let $content = column.render(vitem.data, column, $item.children[index])
      if (!($content instanceof Node)) {
        $content = document.createTextNode($content ?? '')
      }
      $cellInner.innerHTML = ''
      $cellInner.appendChild($content)

      $cell.className = 'cell'
      if (column.cellClass) {
        column.cellClass.forEach(klass => {
          $cell.classList.add(klass)
        })
      }
      $cell.column = column

      const styles: Record<string, any> = {
        width: column.width + 'px',
        minWidth: column.minWidth + 'px',
        maxWidth: column.maxWidth + 'px',
      }

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

      setStyles($cell, styles)
      setStyles($cellInner, {
        textAlign: column.align,
      })
    })
  }

  _renderSummaryRow() {
    if (this.shouldRenderSummary) {
      if (!this._ref.$summary) return
      this._ref.$viewport._ref.$layout.classList.toggle('has-summary', true)

      const data = this.$host.data
      const $items = this._ref.$summary.firstElementChild as HTMLElement

      while ($items.children.length > this.flattenColumns.length) {
        $items.removeChild($items.lastElementChild!)
      }

      const { cellTemplate } = template()
      while ($items.children.length < this.flattenColumns.length) {
        $items.appendChild(cellTemplate.cloneNode(true))
      }

      this.flattenColumns.forEach((column, index) => {
        const $cell = $items.children[index] as CellElement
        const $cellInner = $cell.firstElementChild as HTMLElement
        let $content = column.summaryRender && column.summaryRender(column, index, data, $items.children[index])
        if (!($content instanceof Node)) {
          $content = document.createTextNode($content ?? '')
        }
        $cellInner.innerHTML = ''
        $cellInner.appendChild($content)

        $cell.className = 'cell'
        if (column.cellClass) {
          column.cellClass.forEach(klass => {
            $cell.classList.add(klass)
          })
        }
        $cell.column = column

        const styles: Record<string, any> = {
          width: column.width + 'px',
          minWidth: column.minWidth + 'px',
          maxWidth: column.maxWidth + 'px',
        }

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

        setStyles($cell, styles)
        setStyles($cellInner, {
          textAlign: column.align,
        })
      })
    } else {
      this._ref.$viewport._ref.$layout.classList.toggle('has-summary', false)
    }
  }

  getFixedOffsetLeft(column: RowColumn) {
    let value = 0
    for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
      if (this.fixedLeftColumns[i] === column) return value
      value += column.width
    }
    return value
  }

  getFixedOffsetRight(column: RowColumn) {
    let value = 0
    for (let i = 0; i < this.fixedRightColumns.length; i += 1) {
      if (this.fixedRightColumns[i] === column) return value
      value += column.width
    }
    return value
  }

  getFixedLeftShadowPosition() {
    return this.fixedLeftColumns.reduce((acc, col) => acc + col.width, 0)
  }

  getFixedRightShadowPosition() {
    return this.fixedRightColumns.reduce((acc, col) => acc + col.width, 0)
  }

  _onClick(e: MouseEvent) {
    let $cell: CellElement
    let $row
    let $el = e.target as CellElement | null
    while ($el) {
      if ($el === e.currentTarget) break
      if ($el.classList.contains('cell')) {
        $cell = $el
        dispatchEvent(this, 'click-cell', {
          detail: { $el, column: $el.column },
        })
      }
      if ($el.classList.contains('row')) {
        $row = $el
        dispatchEvent(this, 'click-row', { detail: { $el, data: $el.data } })
        break
      }
      $el = $el.parentElement as CellElement | null
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.upgradeProperty(['columns', 'data'])

    requestAnimationFrame(() => {
      const { cssTemplate2 } = template()
      if (!this._ref.$viewport.shadowRoot!.querySelector('style#tableBodyStyle')) {
        this._ref.$viewport.shadowRoot!.insertBefore(cssTemplate2.cloneNode(true), this._ref.$viewport._ref.$layout)
      }

      if (!this._ref.$viewport._ref.$layout.querySelector('#summary')) {
        const $summary = document.createElement('div')
        $summary.id = 'summary'
        $summary.appendChild(document.createElement('div')).className = 'row'
        this._ref.$viewport._ref.$layout.appendChild($summary)
        this._ref.$summary = $summary
      }
    })
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName === 'cross-size') {
      if (this._ref.$summary) {
        const child = this._ref.$summary.firstElementChild as HTMLElement
        child.style.width = this.crossSize + 'px'
      }
    } else if (attrName === 'sort-field' || attrName === 'sort-order') {
      this.doSort()
    }
  }

  doSort() {
    if (!this.#sortFlag) {
      this.#sortFlag = Promise.resolve().then(() => {
        this.generateViewData()
        this.#sortFlag = undefined
      })
    }
  }
}
