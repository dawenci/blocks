import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div id="layout">
  <div id="track">
    <div id="progress" part="progress"></div>
  </div>
  <div id="value" part="value"></div>
</div>
`)
