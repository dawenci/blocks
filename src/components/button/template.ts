import { makeTemplate } from '../../common/template.js'

export const labelTemplate = makeTemplate(
  /*html*/ `<span id="content"><slot id="slot"></slot></span>`
)
