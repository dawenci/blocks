import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div part="layout" id="layout">
  <span part="checkbox" id="checkbox"></span>
  <label part="label" id="label"><slot part="slot"></slot></label>
</div>
`)
