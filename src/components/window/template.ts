import { makeFragmentTemplate, makeStyleTemplate } from '../../common/template.js'
import {
  __bg_base,
  __color_danger,
  __fg_base,
  __font_family,
  __height_base,
  __radius_base,
  __transition_duration,
  __bg_header,
} from '../../theme/var-light.js'

export const windowStyleTemplate = makeStyleTemplate(/*css*/ `
:host {
  display: none;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  margin: auto;
  padding: 0;
  font-family: var(--font-family, ${__font_family});
  border-radius: var(--bl-radius-base, ${__radius_base});
  color: var(--bl-fg-base, ${__fg_base});
  font-size: 14px;
  backdrop-filter: blur(4px);
  transform-origin: top right;
  min-width: 200px;
}
:host([open]) {
  display: block;
  /* 描边 * 4 + 底部阴影 */
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .5),
    0px 11px 15px -7px rgba(0, 0, 0, 0.1);
}

:host(:focus-within) {
  background-color: var(--bl-bg-base, ${__bg_base});
  backdrop-filter: none;
  opacity: 1;
  outline: 0 none;
  box-shadow:
    0px -1px 0px 0px rgba(0, 0, 0, 0.05),
    0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

:host(:focus) {
  outline: 0 none;
}

:host([maximized]) {
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
}
:host([minimized]) {
  height: auto !important;
}
:host([minimized]) #body {
  height: 0 !important;
  padding: 0;
}

#header-bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: var(--bl-height-base, ${__height_base});
  z-index: -1;
  background-color: var(--bl-bg-header, ${__bg_header});
  opacity: .8;
}
#body-bg {
  position: absolute;
  top: var(--bl-height-base, ${__height_base});
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: var(--bl-bg-base, ${__bg_base});
  opacity: .8;
}

#layout {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
}

/* 标题栏 */
#header {
  box-sizing: border-box;
  flex: 0 0 auto;
  height: var(--bl-height-base, ${__height_base});
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  /* actions(120) + padding(15) */
  padding-right: 135px;
  cursor: move;
  user-select: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .1);
}
:host([maximized]) #header {
  cursor: default;
}

/* 正文区 */
#body {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  flex: 1 1 auto;
}
#body.has-status-bar {
  padding-bottom: 24px;
}
#body.has-status-bar #status-bar {
  display: flex;
}

#content {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

/* 状态栏 */
#status-bar {
  display: none;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  border-top: 1px solid rgba(0, 0, 0, .03);
  background-color: rgba(0, 0, 0, .025);
}

#icon:empty {
  display: none;
}
#icon {
  flex: 0 0 auto;
  height: 14px;
  margin-left: 8px;
}
#icon svg,
#icon img {
  width: 14px;
  height: 14px;
}

#name {
  overflow: hidden;
  box-sizing: border-box;
  flex: 1 1 auto;
  padding: 0 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#actions {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  height: var(--bl-height-base, ${__height_base});
  margin-left: 15px;
}
#actions button {
  display: block;
  position: relative;
  width: 40px;
  height: 100%;
  border: 0;
  background: transparent;
  text-align: center;
}
#actions button:focus {
  outline: none;
}

#maximize:after,
#minimize:after,
:host([maximized]) #maximize:before,
:host([minimized]) #minimize:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  margin: auto;
}

:host([maximized]) #maximize:before {
  height: 8px;
  border-top: 1px solid #aaa;
  border-right: 1px solid #aaa;
  bottom: 6px;
  left: 6px;
}
#maximize:after {
  height: 8px;
  border: 1px solid #aaa;
}
:host([maximized]) #maximize:before,
#maximize:hover:after {
  border-color: #888;
}

:host([minimized]) #minimize:before {
  width: 2px;
  height: 8px;
  background: #aaa;
}
#minimize:after {
  height: 2px;
  background: #aaa;
}
#minimize:hover:after,
:host([minimized]) #minimize:before {
  background: #888;
}

#close {
  fill: #aaa;
}
#close bl-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 14px;
  height: 14px;
  margin: auto;
}
#minimize:hover,
#maximize:hover,
#minimize:focus,
#maximize:focus {
  background: rgba(0, 0, 0, .05);
}
#close:hover,
#close:focus {
  background: var(--bl-color-danger-base, ${__color_danger});
  fill: #fff;
}

:host([maximized]) #resize-top-left,
:host([minimized]) #resize-top-left,
:host([maximized]) #resize-top-right,
:host([minimized]) #resize-top-right,
:host([maximized]) #resize-bottom-right,
:host([minimized]) #resize-bottom-right,
:host([maximized]) #resize-bottom-left,
:host([minimized]) #resize-bottom-left,
:host([maximized]) #resize-top,
:host([minimized]) #resize-top,
:host([maximized]) #resize-right,
:host([minimized]) #resize-right,
:host([maximized]) #resize-bottom,
:host([minimized]) #resize-bottom,
:host([maximized]) #resize-left,
:host([minimized]) #resize-left {
  pointer-events: none;
}

#resize-top-left,
#resize-top-right,
#resize-bottom-right,
#resize-bottom-left {
  position: absolute;
  z-index: 3;
  user-select: none;
}
#resize-top,
#resize-right,
#resize-bottom,
#resize-left {
  position: absolute;
  z-index: 1;
  user-select: none;
}

#resize-top-left,
#resize-top-right,
#resize-bottom-right,
#resize-bottom-left {
  width: 4px;
  height: 4px;
}
#resize-top-left {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}
#resize-top-right {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}
#resize-bottom-right {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}
#resize-bottom-left {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#resize-left,
#resize-right {
  top: 0;
  bottom: 0;
  width: 4px;
  height: 100%;
  cursor: ew-resize;
}
#resize-top,
#resize-bottom {
  width: 100%;
  height: 4px;
  cursor: ns-resize;
}
#resize-left {
  left: 0;
}
#resize-right {
  right: 0;
}
#resize-top {
  top: 0;
}
#resize-bottom {
  bottom: 0;
}

#first, #last, #first:focus, #last:focus {
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}

/* 最大化动画 */
:host(.maximized-enter-transition-active),
:host(.maximized-leave-transition-active) {
  pointer-events: none;
  transition:
    top var(--transition-duration, ${__transition_duration}),
    left var(--transition-duration, ${__transition_duration}),
    width var(--transition-duration, ${__transition_duration}),
    height var(--transition-duration, ${__transition_duration});
}
:host(.maximized-enter-transition-from) {
}
:host(.maximized-enter-transition-to) {
}
:host(.maximized-leave-transition-from) {
}
:host(.maximized-leave-transition-to) {
}
`)

export const windowTemplate = makeFragmentTemplate(/*html*/ `
<div id="header-bg"></div>
<div id="body-bg"></div>

<header id="header">
  <div id="icon"></div>
  <div id="name"></div>
</header>

<section id="body">
  <div id="content">
    <slot></slot>
  </div>
  <footer id="status-bar">
    <slot name="status-bar"></slot>
  </footer>
</section>

<b id="resize-top"></b>
<b id="resize-left"></b>
<b id="resize-right"></b>
<b id="resize-bottom"></b>
<b id="resize-top-left"></b>
<b id="resize-top-right"></b>
<b id="resize-bottom-right"></b>
<b id="resize-bottom-left"></b>

<div id="actions">
  <button id="minimize"></button>
  <button id="maximize"></button>
  <button id="close"><bl-icon value="cross"></bl-icon></button>
</div>
`)
