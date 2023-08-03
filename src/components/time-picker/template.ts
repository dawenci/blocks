import { makeTemplate } from '../../common/template.js'

// export const template = makeTemplate<'bl-input'>(/*html*/ `
// <bl-input part="result" suffix-icon="time" id="result" readonly></bl-input>
// `)

export const template = makeTemplate<'bl-select-result'>(/*html*/ `
<bl-select-result part="result" suffix-icon="time"></bl-select-result>
`)
