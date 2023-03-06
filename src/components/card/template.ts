import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div id="layout">
  <div id="cover"><slot name="cover"></slot></div>
  <header id="header"><slot name="header"></slot></header>
  <div id="body"><slot></slot></div>
  <div id="footer"><slot name="footer"></slot></div>
</div>
`)
