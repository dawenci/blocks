import { BlocksVList } from '../vlist/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setStyles } from '../../common/style.js'
import { dispatchEvent } from '../../common/event.js'
import { __border_color_light } from '../../theme/var.js'
import { intGetter, intSetter } from '../../common/property.js'

// 表格 table 部分样式
const CSS1 = `
:host {
  flex: 1 1 100%;
  overflow: hidden;
}
`

// 表格行、合计行共用样式
const CSS2 = `
/* 表格行 */
.row {
  display: flex;
  flex-flow: row nowrap;
  white-space: nowrap;
  font-size: 0;
  background-color: #fff;
}

.row-active {
  background-color: #e6f2f9;
  color: #0081c2;
}

/* 单元格 */
.cell {
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid var(--border-color-light, ${__border_color_light});
  font-size: 12px;
  align-items: center;
  justify-items: center;
  white-space: normal;
  background: #fff;
}

.row:last-child .cell {
  border-bottom: none;
}

/* 单元格内容 */
.cell-content {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
  text-overflow: ellipsis;
  padding: 4px;
  line-height: 20px;
}

/* border 参数为 true, 为 cell 绘制竖直方向分割线 */
:host-context(bl-table[border]) .cell {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
}

/* 最后一列不要右描边。 */
:host-context(bl-table[border]) .cell:last-child {
  border-right: 0 none;
}
`

// 覆盖 scrollable 排版样式，新增合计行样式
const CSS3 = `
#layout {
  display: flex;
  flex-flow: column nowrap;
}
#layout.has-summary #summary {
  display: block;
}
#viewport {
  flex: 1 1 auto;
}
#layout:not(.has-summary) #viewport.cross-scrollbar {
  margin-bottom: 6px;
}
#summary {
  overflow: hidden;
  display: none;
  position: relative;
  z-index: 0;
  flex: 0 0 auto;
  width: 100%;
  margin-bottom: 6px;
  box-shadow: 0 -2px 3px rgba(0,0,0,.1);
}
`

const cssTemplate = document.createElement('style')
cssTemplate.textContent = CSS1 + CSS2

const cssTemplate2 = document.createElement('style')
cssTemplate2.textContent = CSS2 + CSS3

const cellTemplate = document.createElement('div')
cellTemplate.className = 'cell'
cellTemplate.appendChild(document.createElement('div')).className = 'cell-content'

export class BlocksTableBody extends BlocksVList {
  static get observedAttributes() {
    return BlocksVList.observedAttributes.concat(['sort-field', 'sort-order', 'summary-height'])
  }

  get sortField() {
    return this.getAttribute('sort-field')
  }

  set sortField(value) {
    this.setAttribute('sort-field', value)
  }

  get sortOrder() {
    return this.getAttribute('sort-order')
  }

  set sortOrder(value) {
    this.setAttribute('sort-order', value)
  }

  get summaryHeight() {
    return intGetter('summary-height')(this) || 0
  }

  set summaryHeight(value) {
    intSetter('summary-height')(this, value)
  }

  get shouldRenderSummary() {
    return this.flattenColumns.some(column => typeof column.summaryRender === 'function')
  }

  constructor() {
    super()
    const shadowRoot = this.shadowRoot
    shadowRoot.appendChild(cssTemplate.cloneNode(true))

    this.$scrollable = shadowRoot.getElementById('scrollable')
    this.$listSize = shadowRoot.getElementById('list-size')
    this.$list = shadowRoot.getElementById('list')

    this.flattenColumns = []
    this.fixedLeftColumns = []
    this.fixedRightColumns = []

    this.$list.onclick = this._onClick.bind(this)

    this.addEventListener('scroll', () => {
      // 同步合计行的左右滚动
      if (this.$summary) {
        this.$summary.scrollLeft = this.getScrollCross()
      }
    })
  }

  async sortMethod(data) {
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
      return va.localeCompare(vb) * (column.sortOrder === 'ascending' ? 1 : -1)
    })
    return data
  }

  beforeRender() {
    this.flattenColumns = this.$host.getLeafColumnsWith()
    this.fixedLeftColumns = this.$host.getFixedLeafColumns('left')
    this.fixedRightColumns = this.$host.getFixedLeafColumns('right').reverse()
  }

  afterRender() {
    this._renderSummaryRow()
  }

  itemRender($item, vitem) {
    $item.data = vitem.data
    $item.classList.add('row')
    $item.classList.toggle('row-even', vitem.virtualViewIndex % 2 === 0)
    $item.classList.toggle('row-odd', vitem.virtualViewIndex % 2 !== 0)

    while ($item.children.length > this.flattenColumns.length) {
      $item.removeChild($item.lastElementChild)
    }
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

      const styles = {
        width: column.width + 'px',
        minWidth: column.minWidth + 'px',
        maxWidth: column.maxWidth + 'px',
      }

      if (this.fixedLeftColumns.includes(column)) {
        styles.position = 'sticky'
        styles.left = this.getFixedOffsetLeft(column) + 'px'
        styles.zIndex = '1'
      }
      else if (this.fixedRightColumns.includes(column)) {
        styles.position = 'sticky'
        styles.right = this.getFixedOffsetRight(column) + 'px'
        styles.zIndex = '1'
      }
      else {
        styles.position = ''
        styles.zIndex = ''
      }

      setStyles($cell, styles)
      setStyles($cellInner, {
        textAlign: column.align
      })
    })
  }

  _renderSummaryRow() {
    if (this.shouldRenderSummary) {
      if (!this.$summary) return
      this.$viewport.$layout.classList.toggle('has-summary', true)

      const data = this.$host.data
      const $items = this.$summary.firstElementChild

      while ($items.children.length > this.flattenColumns.length) {
        $items.removeChild($items.lastElementChild)
      }
      while ($items.children.length < this.flattenColumns.length) {
        $items.appendChild(cellTemplate.cloneNode(true))
      }
  
      this.flattenColumns.forEach((column, index) => {
        const $cell = $items.children[index]
        const $cellInner = $cell.firstElementChild
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
  
        const styles = {
          width: column.width + 'px',
          minWidth: column.minWidth + 'px',
          maxWidth: column.maxWidth + 'px',
        }
  
        if (this.fixedLeftColumns.includes(column)) {
          styles.position = 'sticky'
          styles.left = this.getFixedOffsetLeft(column) + 'px'
          styles.zIndex = '1'
        }
        else if (this.fixedRightColumns.includes(column)) {
          styles.position = 'sticky'
          styles.right = this.getFixedOffsetRight(column) + 'px'
          styles.zIndex = '1'
        }
        else {
          styles.position = ''
          styles.zIndex = ''
        }
  
        setStyles($cell, styles)
        setStyles($cellInner, {
          textAlign: column.align
        })
      })


    }
    else {
      this.$viewport.$layout.classList.toggle('has-summary', false)
    }
  }  

  getFixedOffsetLeft(column) {
    let value = 0
    for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
      if (this.fixedLeftColumns[i] === column) return value
      value += column.width
    }
    return value
  }

  getFixedOffsetRight(column) {
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

  _onClick(e) {
    let $cell
    let $row
    let $el = e.target
    while ($el) {
      if ($el === e.currentTarget) break
      if ($el.classList.contains('cell')) {
        $cell = $el
        dispatchEvent(this, 'click-cell', { detail: { $el, column: $el.column } })
      }
      if ($el.classList.contains('row')) {
        $row = $el
        dispatchEvent(this, 'click-row', { detail: { $el, data: $el.data } })
        break
      }
      $el = $el.parentNode
    }
  }

  connectedCallback() {
    super.connectedCallback()

    upgradeProperty(this, 'columns')
    upgradeProperty(this, 'data')

    requestAnimationFrame(() => {
      if (!this.$viewport.shadowRoot.querySelector('style#tableBodyStyle')) {
        this.$viewport.shadowRoot.insertBefore(cssTemplate2.cloneNode(true), this.$viewport.$layout)
      }

      if (!this.$viewport.$layout.querySelector('#summary')) {
        this.$summary = document.createElement('div')
        this.$summary.id = 'summary'
        this.$summary.appendChild(document.createElement('div')).className = 'row'
        this.$viewport.$layout.appendChild(this.$summary)
      }
    })
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)

    if (attrName === 'cross-size') {
      if (this.$summary) {
        this.$summary.firstElementChild.style.width = this.crossSize + 'px'
      }
    }

    else if (attrName === 'sort-field' || attrName === 'sort-order') {
      this.doSort()
    }
  }

  doSort() {
    if (!this._sortFlag) {
      this._sortFlag = Promise.resolve().then(() => {
        this.generateViewData()
        this._sortFlag = null
      })
    }
  }
}

if (!customElements.get('bl-table-body')) {
  customElements.define('bl-table-body', BlocksTableBody)
}
