import { makeTemplate } from '../../common/template.js'


export const template = makeTemplate(/*html*/ `
<div part="layout" id="layout">
  <div part="total" id="total"></div>
  <div part="sizes" id="sizes"></div>
  <div part="pager" id="pager">
    <button part="prev" id="prev"><bl-icon value="left"></button>
    <div part="items" id="items"></div>
    <button part="next" id="next"><bl-icon value="right"></button>
  </div>
  <div part="jump" id="jump"></div>
</div>
`)

export const itemTemplate = makeTemplate(/*html*/ `
<button></button>
`)

export const moreTemplate = makeTemplate<'bl-icon'>(/*html*/ `
<bl-icon value="more"></bl-icon>
`)
