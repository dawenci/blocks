import { makeTemplate } from '../../common/template.js'

export const checkboxTemplate = makeTemplate(/*html*/ `
<span id="checkbox"></span>`)

export const labelTemplate = makeTemplate<HTMLLabelElement>(/*html*/ `
<label id="label"><slot></slot></label>`)
