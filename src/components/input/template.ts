import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate<HTMLInputElement>(/*html*/ `
<input part="content" id="content" class="input" />
`)
