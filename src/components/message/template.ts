import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div id="layout">
  <div id="icon"></div>
  <div id="main">
    <div id="content">
      <slot></slot>
    </div>
  </div>
</div>
`)
