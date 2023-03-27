import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate<HTMLElement>(/*html*/ `
<div part="layout" id="layout">
  <span part="radio" id="radio"></span>
  <label part="label" id="label"><slot part="slot"></slot></label>
</div>
`)
