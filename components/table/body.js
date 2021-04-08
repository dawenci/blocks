import VList, { VirtualItem } from '../vlist/index.js'

import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setStyles } from '../../common/style.js'
import RowColumn from './RowColumn.js'
import { __border_color_light } from '../../theme/var.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  flex: 1 1 100%;
  overflow: hidden;
}

/* 表格行 */
.VGridBody_row {
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0;
  background-color: #fff;
}

.VGridBody_row-active {
  background-color: #e6f2f9;
  color: #0081c2;
}

/* 单元格 */
.VGrid_cell {
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
}

.VGridBody_row:last-child .VGrid_cell {
  border-bottom: none;
}

/* 单元格内容 */
.VGrid_cell>.cell {
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
:host-context(bl-table[border]) .VGrid_cell {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
}

/* 最后一列不要右描边。注：表头有合并格子比较复杂，不在这里处理，最后一列的右描边使用 after 盖住 */
:host-context(bl-table[border]) .VGridBody_row > .VGrid_cell:last-child {
  border-right: 0 none;
}
`

const template = document.createElement('template')
template.innerHTML = `
<div class="VGridHeaderViewport">
  <div class="VGridHeaderCanvas">
    <div class="VGrid_cells"></div>
  </div>
</div>`


const cellTemplate = document.createElement('div')
cellTemplate.className = 'VGrid_cell'
cellTemplate.appendChild(document.createElement('div')).className = 'cell'

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
  }

  get area() {
    return enumGetter('area', ['main', 'left', 'right'], 'main')(this)
  }

  set area(value) {
    enumSetter('area', ['main', 'left', 'right'])(this, value)
  }

  itemRender($item, vitem) {
    $item.classList.add('VGridBody_row')
    $item.classList.toggle('VGridBody_row-even', vitem.virtualViewIndex % 2 === 0)
    $item.classList.toggle('VGridBody_row-odd', vitem.virtualViewIndex % 2 !== 0)

    let columns
    if (this.area === 'main') {
      const shouldShowFixedColumns = this.$host.shouldShowFixedColumns()
      columns = shouldShowFixedColumns
        ? this.$host.getFlattenNonfixedColumns()
        : this.$host.getFlattenColumns()
  
      // 插入左固定列占位
      if (shouldShowFixedColumns && this.hasFixedLeft()) {
        columns.unshift(new RowColumn({
          width: this.$host.fixedLeftWidth(),
          cellClass: ['VGrid_cell_padding', 'VGrid_cell_padding-left']
        }))
      }
  
      // 插入右固定列占位
      if (shouldShowFixedColumns && this.hasFixedRight()) {
        columns.push(new RowColumn({
          width: this.$host.fixedRightWidth(),
          cellClass: ['VGrid_cell_padding', 'VGrid_cell_padding-right']
        }))
      }
    }
    else {
      columns = this.$host.getFlattenFixedColumns(this.area)
    }

    while ($item.children.length > columns.length) {
      $item.removeChild($item.lastElementChild)
    }
    while ($item.children.length < columns.length) {
      $item.appendChild(cellTemplate.cloneNode(true))
    }

    columns.forEach((column, index) => {
      const $cell = $item.children[index]
      const $cellInner = $cell.firstElementChild
      const $content = column.render(vitem.data, column, $item.children[index])
      $cellInner.innerHTML = ''
      $cellInner.appendChild($content)

      $cell.className = 'VGrid_cell'
      if (column.cellClass) {
        column.cellClass.forEach(klass => {
          $cell.classList.add(klass)
        })
      }

      setStyles($cell, {
        width: column.width + 'px',
        minWidth: column.minWidth + 'px',
        maxWidth: column.maxWidth + 'px',
      })
      setStyles($cellInner, {
        textAlign: column.align
      })
    })
  }

  connectedCallback() {
    super.connectedCallback()

    upgradeProperty(this, 'area')
    upgradeProperty(this, 'columns')
    upgradeProperty(this, 'data')
  }
}

if (!customElements.get('bl-table-body')) {
  customElements.define('bl-table-body', BlocksTableBody)
}
