import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div part="layout" id="layout">
  <div part="panes" id="panes"><slot part="default-slot"></slot></div>
  <div part="cover" id="cover"></div>
</div>
`)
