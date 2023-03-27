import { makeFragmentTemplate } from '../../common/template.js'

export const template = makeFragmentTemplate(/*html*/ `
<div part="shadow"></div>
<svg part="bg"><path></path></svg>
<div part="layout" id="layout">
  <slot part="default-slot"></slot>
</div>
`)
