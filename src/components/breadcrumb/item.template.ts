import { makeFragmentTemplate } from '../../common/template.js'

export const template = makeFragmentTemplate(/*html*/ `
<a id="link"><slot></slot></a>
<div id="separator"></div>
`)
