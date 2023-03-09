import { makeTemplate } from '../../common/template.js'

export const radioTemplate = makeTemplate<HTMLSpanElement>(
  /*html*/ `<span id="radio"></span>`
)

export const labelTemplate = makeTemplate<HTMLLabelElement>(
  /*html*/ `<label id="label"><slot></slot></label>`
)
