import { makeTemplate } from '../../common/template.js'
import { BlTag } from '../tag/index.js'

export const contentTemplate = makeTemplate(/*html*/ `<div part="content" id="content"></div>`)

export const tagTemplate = makeTemplate<BlTag>(`<bl-tag></bl-tag>`)

export const moreTemplate = makeTemplate(/*html*/ `<div part="more" class="more"></div>`)

// 设 placeholder 为 " " 而不是空字符串，方便控制 placeholder-show 伪类生效
export const searchTemplate = makeTemplate<HTMLInputElement>(
  /*html*/ `<input part="search" class="search" placeholder=" " />`
)

export const valueTextTemplate = makeTemplate(/*html*/ `<div part="value-text" class="value-text"></div>`)

export const placeholderTemplate = makeTemplate(/*html*/ `<div part="placeholder" id="placeholder"></div>`)
