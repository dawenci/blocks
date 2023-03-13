import { makeTemplate } from '../../common/template.js'
import { BlocksTag } from '../tag/index.js'

export const contentTemplate = makeTemplate(/*html*/ `<div id="content"></div>`)

export const tagTemplate = makeTemplate<BlocksTag>(`<bl-tag tabindex="-1"></bl-tag>`)

export const moreTemplate = makeTemplate(/*html*/ `<div class="more"></div>`)

// 设 placeholder 为 " " 而不是空字符串，方便控制 placeholder-show 伪类生效
export const searchTemplate = makeTemplate<HTMLInputElement>(
  /*html*/ `<input class="search" tabindex="0" placeholder=" " />`
)

export const valueTextTemplate = makeTemplate(/*html*/ `<div class="value-text"></div>`)

export const placeholderTemplate = makeTemplate(/*html*/ `<div id="placeholder"></div>`)
