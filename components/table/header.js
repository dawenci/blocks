import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __bg_base_header, __border_color_light, __fg_secondary } from '../../theme/var.js'
import RowColumn from './RowColumn.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  flex: 1 0 auto;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  font-size: 0;
  font-weight: 700;
  background-color: var(--bg-base-header, ${__bg_base_header});
  color: var(--fg-secondary, ${__fg_secondary});
}


/* 滚动条占位, 顺便盖住最右边的一个 cell 分割竖线 */
:host::after {
  position: relative;
  z-index: 1;
  left: -1px;
  flex: 1 1 1px;
  min-width: 1px;
  display: block;
  content: '';
  border-bottom: 1px solid var(--border-color-light, ${__border_color_light});
  background-color: var(--bg-base-header, ${__bg_base_header});
}

/* 表头区视口 */
:host .VGridHeaderViewport {
  flex: 0 0 auto;
  overflow: hidden;
  width: 100%;
}

/* 表头区内容排版容器 */
.VGridHeaderCanvas {
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
}


/* 合并单元格（表头中） */
.VGrid_cells {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  font-size: 12px;
  align-items: center;
  justify-items: center;
  white-space: normal;
}
/* 合并单元格自己的内容 */
.VGrid_cells>.VGrid_cells_label {
  flex: 0 0 auto;
  width: 100%;
}
/* 合并单元格下级单元格容器 */
.VGrid_cells>.VGrid_cells_children {
  flex: 1 1 100%;
  display: flex;
  flex-flow: row nowrap;
}

/* 单元格 */
.VGrid_cell {
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


/* border 参数为 true */
/* 为 cell 绘制竖直方向分割线 */
:host-context(bl-table[border]) .VGrid_cell {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
}
`

const template = document.createElement('template')
template.innerHTML = `
<div class="VGridHeaderViewport">
  <div class="VGridHeaderCanvas"></div>
</div>`


const cellTemplate = document.createElement('div')
cellTemplate.className = 'VGrid_cell'
cellTemplate.appendChild(document.createElement('div')).className = 'cell'

const groupTemplate = document.createElement('div')
groupTemplate.className = 'VGrid_cells'
groupTemplate.appendChild(document.createElement('div')).className = 'VGrid_cells_label'
groupTemplate.appendChild(document.createElement('div')).className = 'VGrid_cells_children'


export default class BlocksTableHeader extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$canvas = shadowRoot.querySelector('.VGridHeaderCanvas')
  }

  get area() {
    return enumGetter('area', ['main', 'left', 'right'], 'main')(this)
  }

  set area(value) {
    enumSetter('area', ['main', 'left', 'right'])(this, value)
  }

  get columns() {
    return this._columns
  }

  set columns(value) {
    this._columns = value
    this.render()
  }

  render() {
    let columns
    if (this.area === 'main') {
      const shouldShowFixedColumns = this.$host.shouldShowFixedColumns()
      columns = shouldShowFixedColumns
        ? this.$host.columns.filter((column) => !column.fixedLeft && !column.fixedRight)
        : this.$host.columns

      // 插入左固定列占位
      if (shouldShowFixedColumns && this.$host.hasFixedLeft()) {
        columns.unshift(new RowColumn({
          cellClass: ['VGrid_cell_padding', 'VGrid_cell_padding-left'],
          width: this.fixedLeftWidth()
        }))
      }
      // 插入右固定列占位
      if (shouldShowFixedColumns && this.$host.hasFixedRight()) {
        columns.push(new RowColumn({
          cellClass: ['VGrid_cell_padding', 'VGrid_cell_padding-right'],
          width: this.fixedRightWidth()
        }))
      }
    }
    else {
      const fixed = this.area === 'left' ? 'fixedLeft' : 'fixedRight'
      columns = this.$host.columns.filter(column => column[fixed])
    }

    const render = (column, $wrap) => {
      const { columnWidth, minWidth, maxWidth, align } = column
      const hasChildren = !!column.children.length
      const style = {}
      const cellStyle = {}
      if (!hasChildren) {
        style.width = (columnWidth ?? 80) + 'px'
        if (minWidth) style.minWidth = minWidth + 'px'
        if (maxWidth && maxWidth !== Infinity) style.maxWidth = maxWidth + 'px'
      }
      if (align) {
        cellStyle.textAlign = align
      }

      // 渲染自定义模板 OR 渲染 label
      const $content = column.headRender(column)
      const $cell = cellTemplate.cloneNode(true)
      const $cellInner = $cell.firstElementChild
      $cellInner.innerHTML = ''
      $cellInner.appendChild($content)

      setStyles($cell, {
        width: column.width + 'px',
        minWidth: column.minWidth + 'px',
        maxWidth: column.maxWidth + 'px',
      })
      setStyles($cellInner, {
        textAlign: column.align
      })

      // 嵌套表头
      if (hasChildren) {
        const $group = groupTemplate.cloneNode(true)
        $group.querySelector('.VGrid_cells_label').appendChild($cell)
        const $children = $group.querySelector('.VGrid_cells_children')
        column.children.forEach(child => {
          render(child, $children)
        })

        $wrap.appendChild($group)
      }
      else {
        $wrap.appendChild($cell)
      }
    }

    this.$canvas.innerHTML = ''
    columns.forEach(column => render(column, this.$canvas))
  }

  connectedCallback() {
    upgradeProperty(this, 'area')
    upgradeProperty(this, 'columns')
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('bl-table-header')) {
  customElements.define('bl-table-header', BlocksTableHeader)
}
