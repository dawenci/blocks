import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `<div part="layout" id="layout"></div>`)

export const loadingTemplate = makeTemplate(/*html*/ `<span part="loading" id="loading"></span>`)

export const prefixTemplate = makeTemplate(/*html*/ `<span part="prefix" id="prefix"></span>`)

export const suffixTemplate = makeTemplate(/*html*/ `<span part="suffix" id="suffix"></span>`)
