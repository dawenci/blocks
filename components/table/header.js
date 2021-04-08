import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __bg_base_header, __border_color_light, __fg_secondary } from '../../theme/var.js'
import RowColumn from './RowColumn.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  display: block;
  flex: 1 0 auto;
  overflow: hidden;
  position: relative;
  font-size: 0;
  font-weight: 700;
  background-color: #f3f3f3;
  color: var(--fg-secondary, ${__fg_secondary});
}


/* 滚动条占位, 顺便盖住最右边的一个 cell 分割竖线 */
:host::after {
  content: '';
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: #f3f3f3;
}

/* 表头区视口 */
:host .viewport {
  flex: 0 0 auto;
  overflow: hidden;
  width: 100%;
}

/* 表头区内容排版容器 */
.columns {
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  white-space: nowrap;
}

.viewport > .columns {
  overflow: visible;
}

/* 合并单元格（表头中） */
.group {
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
.group>.group_label {
  flex: 0 0 auto;
  width: 100%;
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


/* border 参数为 true */
/* 为 cell 绘制竖直方向分割线 */
:host-context(bl-table[border]) .cell {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
}
`

const template = document.createElement('template')
template.innerHTML = `
<div class="viewport">
  <div class="columns"></div>
</div>`


const cellTemplate = document.createElement('div')
cellTemplate.className = 'cell'
cellTemplate.appendChild(document.createElement('div')).className = 'cell-content'

const groupTemplate = document.createElement('div')
groupTemplate.className = 'group'
groupTemplate.appendChild(document.createElement('div')).className = 'group_label'
groupTemplate.appendChild(document.createElement('div')).className = 'columns'


export default class BlocksTableHeader extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$viewport = shadowRoot.querySelector('.viewport')
    this.$canvas = shadowRoot.querySelector('.columns')
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

  get scrollLeft() {
    return this.$viewport.scrollLeft
  }

  set scrollLeft(value) {
    this.$viewport.scrollLeft = value
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
          cellClass: ['cell_padding', 'cell_padding-left'],
          width: this.$host.fixedLeftWidth()
        }))
      }
      // 插入右固定列占位
      if (shouldShowFixedColumns && this.$host.hasFixedRight()) {
        columns.push(new RowColumn({
          cellClass: ['cell_padding', 'cell_padding-right'],
          width: this.$host.fixedRightWidth()
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
        $group.querySelector('.group_label').appendChild($cell)
        $cell.style.width = ''

        const $children = $group.querySelector('.columns')
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
