import { makeStyleTemplate, makeTemplate } from '../../common/template.js'
import { __fg_placeholder, __font_size_small } from '../../theme/var-light.js'
import { BlocksTag } from '../tag/index.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
:host {
  width: 200px;
  height: var(--height);
}
:host([multiple]) {
  height: auto;
}
:host([multiple]) #layout {
  min-height: calc(var(--height) - 2px);
}
#content {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 4px;
  height: 100%;
}
#placeholder {
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: var(--height);
  line-height: var(--height);
  margin: auto 8px;
  color: var(--bl-fg-placeholder, ${__fg_placeholder});
  pointer-events: none;
}
#content:not(:empty) + #placeholder {
  display: none;
}

.value-text {
  margin: 0 8px;
}

bl-tag {
  margin: 1px;
  flex: 0 0 auto;
  border: 0 none;
  background-color: var(--bl-bg-active);
}
bl-tag:focus {
  outline: 0 none;
}
.more {
  font-size: var(--bl-font-size-small, ${__font_size_small});
  user-select: none;
  color: var(--bl-fg-secondary);
}

.search {
  box-sizing: border-box;
  border: 0;
  background: rgba(255,255,255,0);
}
.search:focus {
  outline: 0 none;
  background: rgba(255,255,255,.5);
}

.single .search {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 12px;
}
/* 输入搜索内容后（placeholder 不显示）的搜索框相邻的结果值隐藏 */
.single .search:not(:placeholder-shown) + .value-text {
  visibility: hidden;
}

.multiple .search {
  flex: 1 1 32px;
  min-width: 32px;
}
.multiple bl-tag+.search {
  margin-left: 4px;
}
`)

export const contentTemplate = makeTemplate(/*html*/ `<div id="content"></div>`)

export const tagTemplate = makeTemplate<BlocksTag>(
  `<bl-tag tabindex="-1"></bl-tag>`
)

export const moreTemplate = makeTemplate(/*html*/ `<div class="more"></div>`)

// 设 placeholder 为 " " 而不是空字符串，方便控制 placeholder-show 伪类生效
export const searchTemplate = makeTemplate<HTMLInputElement>(
  /*html*/ `<input class="search" tabindex="0" placeholder=" " />`
)

export const valueTextTemplate = makeTemplate(
  /*html*/ `<div class="value-text"></div>`
)

export const placeholderTemplate = makeTemplate(
  /*html*/ `<div id="placeholder"></div>`
)
