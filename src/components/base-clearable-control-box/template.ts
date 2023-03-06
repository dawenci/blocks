import { makeTemplate } from '../../common/template.js'

export const clearTemplate = makeTemplate<HTMLButtonElement>(/*html*/ `
  <button id="clear" part="clear" tabindex="-1"></button>
`)
