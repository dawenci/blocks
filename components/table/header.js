import { dispatchEvent } from '../../common/event.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __bg_base_header, __border_color_light, __color_primary, __fg_placeholder, __fg_secondary } from '../../theme/var.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  display: block;
  flex: 1 0 auto;
  overflow: hidden;
  position: relative;
  font-size: 0;
  font-weight: 700;
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
#viewport {
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

#viewport > .columns {
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
.group_label {
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
  background-color: #f3f3f3;
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

/* 排序 */
.cell.sortable {
  cursor: pointer;
}
.sort {
  margin-right: 8px;
}
.sort::before,
.sort::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  margin: 2px 0;
  border: 3px solid transparent;
}
.sort::before {
  border-bottom: 4px solid var(--fg-placeholder, ${__fg_placeholder});
}
.sort::after {
  border-top: 4px solid var(--fg-placeholder, ${__fg_placeholder});
}
.sort.ascending::before {
  border-bottom-color: var(--color-primary, ${__color_primary});
}
.sort.descending::after {
  border-top-color: var(--color-primary, ${__color_primary});
}


/* border 参数为 true */
/* 为 cell 绘制竖直方向分割线 */
:host-context(bl-table[border]) .cell {
  border-right: 1px solid var(--border-color-light, ${__border_color_light});
}
`

const template = document.createElement('template')
template.innerHTML = `
<div id="viewport"><div class="columns"></div></div>`


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

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$viewport = shadowRoot.querySelector('#viewport')
    this.$canvas = shadowRoot.querySelector('.columns')

    this._initHoverEvent()

    this.$canvas.onclick = e => {
      let $el = e.target
      while ($el !== this.$canvas) {
        if ($el.classList.contains('sortable')) {
          const column = $el.column
          switch(column.sortOrder) {
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
          this.$host.getLeafColumnsWith().forEach(col => {
            if (col.sortOrder && col !== column) {
              col.sortOrder = 'none'
            }
          })
          this.render()
          dispatchEvent(this, 'sort', { detail: { column } })
          break
        }        
        $el = $el.parentNode
      }
    }
  }

  _initHoverEvent() {
    this.$canvas.addEventListener('mouseover', e => {
      let $cell = e.target
      while ($cell && $cell !== this.$canvas) {
        if ($cell.classList.contains('cell')) {
          if ($cell === this._$cell) return
          this._$cell = $cell
          dispatchEvent(this, 'enter-cell', { detail: { $cell, column: $cell.column } })
          return
        }
        $cell = $cell.parentNode
      }
    })
  }  

  widthSum(column, value = 0) {
    if (column.children.length) {
      column.children.forEach(child => this.widthSum(child, value))
    }
    else {
      value += column.width
    }
    return value
  }

  getFixedOffsetLeft(column) {
    let value = 0
    for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
      if (this.fixedLeftColumns[i] === column) return value
      value = this.widthSum(this.fixedLeftColumns[i], value)
    }
    return value
  }

  getFixedOffsetRight(column) {
    let value = 0
    for (let i = 0; i < this.fixedRightColumns.length; i += 1) {
      if (this.fixedRightColumns[i] === column) return value
      value = this.widthSum(this.fixedRightColumns[i], value)
    }
    return value
  }

  render() {
    const columns = this.$host.columns
    this.fixedLeftColumns = columns.filter(column => column.fixedLeft)
    this.fixedRightColumns = columns.filter(column => column.fixedRight).reverse()

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
      let $content = column.headRender(column)
      if (!($content instanceof Node)) {
        $content = document.createTextNode($content ?? '')
      }

      const $cell = cellTemplate.cloneNode(true)
      const $cellInner = $cell.firstElementChild
      $cellInner.innerHTML = ''
      $cellInner.appendChild($content)

      if (!column.children?.length && column.sortOrder != null) {
        $cell.classList.add('sortable')
        if (!$cell.querySelector('.sort')) {
          const $sort = $cell.appendChild(document.createElement('div'))
          $sort.className = `sort ${column.sortOrder}`
        }
      }
      else {
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
        textAlign: column.align
      })

      const styles = {}
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

      // 嵌套表头
      if (hasChildren) {
        const $group = groupTemplate.cloneNode(true)
        $group.querySelector('.group_label').appendChild($cell)
        $cell.style.width = ''

        const $children = $group.querySelector('.columns')
        column.children.forEach(child => {
          render(child, $children)
        })

        setStyles($group, styles)
        $wrap.appendChild($group)
      }
      else {
        setStyles($cell, styles)
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
