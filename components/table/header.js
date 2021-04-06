import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  flex: 1 0 auto;
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  font-size: 0;
  font-weight: 700;
  background-color: #F5F7FA;
  color: $--color-text-secondary;
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
  border-bottom: 1px solid $--border-color-lighter;
  background-color: #F5F7FA;
}

/* 表头区视口 */
:host .VGridHeaderViewport {
  flex: 0 0 auto;
  overflow: hidden;
  // 表头区内容排版容器
  .VGridHeaderCanvas {
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
  }
}
`

const template = document.createElement('template')
template.innerHTML = `
<div class="VGridHeaderViewport">
  <div class="VGridHeaderCanvas">
    <div class="VGrid_cells"></div>
  </div>
</div>`


export default class BlocksTableHeader extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor({ columns, area }) {
    super()
    this.columns = columns
    this.area = area
  }

  render() {
    switch (this.area) {
      case 'main':
        return this._renderMain(createElement)
      case 'left':
        return this._renderLeft(createElement)
      case 'right':
        return this._renderRight(createElement)
    }
  }

  _renderMain(createElement: Vue.CreateElement) {
    const shouldShowFixedColumns = this.shouldShowFixedColumns()
    const columns = shouldShowFixedColumns
      ? this.store.columns.filter((column: VGridColumn) => !column.fixedLeft && !column.fixedRight)
      : this.store.columns
    const cells = columns
      .map((column: VGridColumn, index: number) => {
        return column.renderHeader(createElement, { column, index })
      })

    // 插入左固定列占位
    if (shouldShowFixedColumns && this.hasFixedLeft()) {
      cells.unshift(createElement('div', {
        class: ['VGrid_cell', 'VGrid_cell_padding', 'VGrid_cell_padding-left'],
        style: {
          width: this.fixedLeftWidth() + 'px',
        }
      }))
    }

    // 插入右固定列占位
    if (shouldShowFixedColumns && this.hasFixedRight()) {
      cells.push(createElement('div', {
        class: ['VGrid_cell', 'VGrid_cell_padding', 'VGrid_cell_padding-right'],
        style: {
          width: this.fixedRightWidth() + 'px',
        }
      }))
    }

    const scrollbarWidth = this.canvasWidth - this.viewportWidth

    const row = createElement('div', {
      ref: 'content',
      class: 'VGridHeaderCanvas',
      style: {
        width: this.canvasWidth + (scrollbarWidth) + 'px',
        'min-height': this.headerHeight + 'px',
      },
      on: {
        mouseover: this._onEnterCell,
        mouseout: this._onLeaveCell,
      }
    }, cells)

    const viewport = createElement('div', {
      ref: 'viewport',
      class: 'VGridHeaderViewport',
      style: {
        width: this.viewportWidth + 'px',
      },
      domProps: {
        scrollLeft: this.scrollLeft ?? 0,
      }
    }, [row])

    const header = createElement('div',
      {
        ref: 'header',
        class: 'VGridHeader',
      }, [viewport])

    return header
  }

  _renderFixed(createElement: Vue.CreateElement, area: 'left' | 'right') {
    // 左固定列
    const cells = this.store.columns
      .filter((column: VGridColumn) => column[area === 'left' ? 'fixedLeft' : 'fixedRight'])
      .map((column: VGridColumn, index: number) => {
        return column.renderHeader(createElement, { column, index })
      })

    const row = createElement('div', {
      ref: 'content',
      class: 'VGridHeaderCanvas',
      style: {
        width: this.canvasWidth + 'px',
        'min-height': this.headerHeight + 'px',
      },
      on: {
        mouseover: this._onEnterCell,
        mouseout: this._onLeaveCell,
      }
    }, cells)

    const viewport = createElement('div', {
      ref: 'viewport',
      class: 'VGridHeaderViewport',
      style: {
        width: this.viewportWidth + 'px',
      }
    }, [row])

    const header = createElement('div',
      {
        ref: 'header',
        class: 'VGridHeader',
      }, [viewport])

    return header
  }

  _renderLeft(createElement: Vue.CreateElement) {
    return this._renderFixed(createElement, 'left')
  }

  _renderRight(createElement: Vue.CreateElement) {
    return this._renderFixed(createElement, 'right')
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('bl-table-header')) {
  customElements.define('bl-table-header', BlocksTableHeader)
}
