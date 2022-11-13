import {
  __border_color_base,
  __color_primary,
  __fg_placeholder,
  __fg_secondary,
} from '../../theme/var-light.js'

let templateCache: {
  cssTemplate: HTMLStyleElement
  comTemplate: HTMLTemplateElement
  cellTemplate: HTMLDivElement
  groupTemplate: HTMLDivElement
}

export function template() {
  if (templateCache) return templateCache

  const cssTemplate = document.createElement('style')
  cssTemplate.textContent = /*css*/ `
  :host {
    display: block;
    flex: 1 0 auto;
    overflow: hidden;
    position: relative;
    font-size: 0;
    font-weight: 700;
    color: var(--bl-fg-secondary, ${__fg_secondary});
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
    border-bottom: 1px solid var(--bl-border-color-base, ${__border_color_base});
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
    border-bottom: 4px solid var(--bl-fg-placeholder, ${__fg_placeholder});
  }
  .sort::after {
    border-top: 4px solid var(--bl-fg-placeholder, ${__fg_placeholder});
  }
  .sort.ascending::before {
    border-bottom-color: var(--bl-color-primary-base, ${__color_primary});
  }
  .sort.descending::after {
    border-top-color: var(--bl-color-primary-base, ${__color_primary});
  }
  
  
  /* border 参数为 true */
  /* 为 cell 绘制竖直方向分割线 */
  :host-context(bl-table[border]) .cell {
    border-right: 1px solid var(--bl-border-color-base, ${__border_color_base});
  }
  `

  const comTemplate = document.createElement('template')
  comTemplate.innerHTML = /*html*/ `
  <div id="viewport"><div class="columns"></div></div>`

  const cellTemplate = document.createElement('div')
  cellTemplate.className = 'cell'
  cellTemplate.appendChild(document.createElement('div')).className =
    'cell-content'

  const groupTemplate = document.createElement('div')
  groupTemplate.className = 'group'
  groupTemplate.appendChild(document.createElement('div')).className =
    'group_label'
  groupTemplate.appendChild(document.createElement('div')).className = 'columns'

  return (templateCache = {
    cssTemplate,
    comTemplate,
    cellTemplate,
    groupTemplate,
  })
}
