import { makeFragmentTemplate, makeStyleTemplate, } from '../../common/template.js';
import { __bg_base, __fg_base, __font_family, __radius_base, __z_index_dialog_base, __z_index_dialog_focus, } from '../../theme/var-light.js';
export const dialogStyleTemplate = makeStyleTemplate(`
:host {
  display: none;
  font-family: var(--font-family, ${__font_family});
  position:absolute;
  margin:auto;
}

:host {
  z-index: var(--z-index, var(--bl-z-index-dialog-base, ${__z_index_dialog_base}));
}

:host(:focus-within) {
  z-index: var(--z-index-focus, var(--bl-z-index-dialog-focus, ${__z_index_dialog_focus}));
}

:host([open]) {
  display: block;
}

:host(:focus) {
  outline: 0 none;
}

/* 对话框 */
#layout {
  box-sizing: border-box;
  position:relative;
  display:inline-flex;
  flex-flow: column nowrap;
  margin:auto;
  vertical-align: top;
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 20px);
  border-radius: var(--bl-radius-base, ${__radius_base});
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
}

#layout {
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
}
:host(:focus-within) #layout, #layout:focus-within {
  outline: 0 none;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

/* 标题栏 */
header {
  box-sizing: border-box;
  flex: 1 1 auto;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  padding: 10px 15px;
  line-height: 1.428571429;
  cursor: move;
  user-select: none;
}
.no-header header {
  display: none;
}
:host([closeable]) header {
  padding-right: 45px;
}

:host([closeable]) .no-header section {
  min-height: 38px;
  padding-right: 45px;
}
:host([closeable]) .no-header.no-footer section {
  min-height: 78px;
}

header h1 {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  color: #4c5161;
  user-select: none;
  cursor: default;
}
h1:empty {
  display: none;
}

/* 内容区 */
section {
  box-sizing: border-box;
  display:flex;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  flex:1;
  flex-direction:column;
  overflow: auto;
}
.no-header section {
  padding-top: 15px;
}
.no-footer section {
  padding-top: 10px;
  padding-bottom: 30px;
}
.no-header.no-footer section {
  padding-top: 30px;
  padding-bottom: 30px;
}

/* 脚部 */
footer {
  box-sizing: border-box;
  padding: 10px 15px;
  text-align: right;
}
.no-footer footer {
  display: none;
}

/* 关闭按钮 */
#close {
  overflow: hidden;
  position:absolute;
  z-index: 1;
  right:10px;
  top:10px;
  display: block;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0 none;
  background: transparent;
  fill: #aaa;
}
#close:hover,
#close:focus,
#close:active {
  background-color: transparent;
  fill: #888;
  outline: 0 none;
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
`);
export const dialogTemplate = makeFragmentTemplate(`
<header>
<slot name="header">
  <h1></h1>
</slot>
</header>

<section>
<slot></slot>
</section>

<footer>
<slot name="footer"></slot>
</footer>

<button id="close"></button>
`);
