import { makeFragmentTemplate } from '../../common/template.js'

export const template = makeFragmentTemplate(/*html*/ `
<header class="header"></header>
  <div class="list">
    <slot></slot>
  </div>
`)
