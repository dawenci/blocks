import VList, { VirtualItem } from '../vlist/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setStyles } from '../../common/style.js'
import { dispatchEvent } from '../../common/event.js'
import { __border_color_light } from '../../theme/var.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  flex: 1 1 100%;
  overflow: hidden;
}

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
.cell>.cell-content {
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

/* 最后一列不要右描边。注：表头有合并格子比较复杂，不在这里处理，最后一列的右描边使用 after 盖住 */
:host-context(bl-table[border]) .row > .cell:last-child {
  border-right: 0 none;
}
`


const cellTemplate = document.createElement('div')
cellTemplate.className = 'cell'
cellTemplate.appendChild(document.createElement('div')).className = 'cell-content'

class VirtualRow extends VirtualItem {
  constructor(options) {
    super(options)

    // 过滤时临时使用
    this._retain = false
  }
}


export default class BlocksTableBody extends VList {
  static get observedAttributes() {
    return VList.observedAttributes.concat([])
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
  }

  beforeRender() {
    this.flattenColumns = this.$host.getFlattenColumns()
    this.fixedLeftColumns = this.flattenColumns.filter(column => {
      let col = column
      while (col) {
        if (col.fixedLeft) return true
        col = col.parent
      }
      return false
    })
    this.fixedRightColumns = this.flattenColumns.filter(column => {
      let col = column
      while (col) {
        if (col.fixedRight) return true
        col = col.parent
      }
      return false
    }).reverse()
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
      const $content = column.render(vitem.data, column, $item.children[index])
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

    upgradeProperty(this, 'area')
    upgradeProperty(this, 'columns')
    upgradeProperty(this, 'data')

    requestAnimationFrame(() => {
      if (!this.$viewport.shadowRoot.querySelector('style#tableBodyStyle')) {
        const style = this.$viewport.shadowRoot.insertBefore(document.createElement('style'), this.$viewport.$layout)
        style.id = 'tableBodyStyle'
        style.textContent = `
        #viewport.cross-scrollbar {
          height: calc(100% - 6px);
        }
        `
      }
    })
  }
}

if (!customElements.get('bl-table-body')) {
  customElements.define('bl-table-body', BlocksTableBody)
}
