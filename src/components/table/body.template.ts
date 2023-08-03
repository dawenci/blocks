import { makeTemplate } from '../../common/template.js'

export const cellTemplate = makeTemplate(/*html*/ `
<div class="cell"><div class="cell-content"></div></div>
`)

export const summaryTemplate = makeTemplate(/*html*/ `
<div id="summary"><div class="row"></div></div>
`)
