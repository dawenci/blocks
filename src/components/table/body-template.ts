import { __border_color_base } from '../../theme/var-light.js'

let templateCache: {
  cssTemplate: HTMLStyleElement
  cssTemplate2: HTMLStyleElement
  cellTemplate: HTMLDivElement
}

export function template() {
  if (templateCache) return templateCache

  // 表格 table 部分样式
  const CSS1 = /*css*/ `
:host {
  flex: 1 1 100%;
  overflow: hidden;
}
`

  // 表格行、合计行共用样式
  const CSS2 = /*css*/ `
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
  border-bottom: 1px solid var(--bl-border-color-base, ${__border_color_base});
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
  border-right: 1px solid var(--bl-border-color-base, ${__border_color_base});
}

/* 最后一列不要右描边。 */
:host-context(bl-table[border]) .cell:last-child {
  border-right: 0 none;
}
`

  // 覆盖 scrollable 排版样式，新增合计行样式
  const CSS3 = /*css*/ `
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
  cellTemplate.appendChild(document.createElement('div')).className =
    'cell-content'

  return (templateCache = {
    cssTemplate,
    cssTemplate2,
    cellTemplate,
  })
}
