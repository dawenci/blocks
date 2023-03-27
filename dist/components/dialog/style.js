import { __padding_large, __z_index_dialog_base, __z_index_dialog_focus } from '../../theme/var-light.js';
export const style = `
/* <component>dialog */
:host {
  --padding: var(--bl-padding-large, ${__padding_large});

  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 20px);
  z-index: var(--z-index, var(--bl-z-index-dialog-base, ${__z_index_dialog_base}));
}
:host(:focus), :host(:focus-within), :host(:focus-visible) {
  z-index: var(--z-index-focus, var(--bl-z-index-dialog-focus, ${__z_index_dialog_focus}));
}

[part="shadow"] {
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
}

:host(:focus) [part="shadow"], :host(:focus-within) [part="shadow"], :host(:focus-visible) [part="shadow"] {
  outline: 0 none;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}


/* 对话框 */
[part="layout"] {
  display:inline-flex;
  vertical-align: top;
  flex-flow: column nowrap;
}


/* 标题栏 */
[part="header"] {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  padding: 12px var(--padding);
  line-height: 1.428571429;
  cursor: move;
  user-select: none;
}
:host([closeable]) [part="header"] {
  padding-right: 32px;
}
[part="header"] h1 {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  font-weight: 700;
  color: #4c5161;
  user-select: none;
  cursor: default;
}
[part="header"] h1:empty {
  display: none;
}
.no-header [part="header"] {
  display: none;
}


/* 内容区 */
[part="body"] {
  box-sizing: border-box;
  flex: 1 1 100%;
  display: flex;
  margin: 0 var(--padding);
  padding: 0;
  flex-direction:column;
  overflow: auto;
}
.no-header [part="body"] {
  margin-top: var(--padding);
}
:host([closeable]) .no-header [part="body"] {
  margin-top: 32px;
}
.no-footer [part="body"] {
  margin-bottom: var(--padding);
}


/* 脚部 */
[part="footer"] {
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 12px var(--padding);
}
.no-footer [part="footer"] {
  display: none;
}


/* 关闭按钮 */
[part="close"] {
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
}
[part="close"]::before,
[part="close"]::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 14px;
  height: 1px;
  margin: auto;
  background-color: #aaa;
}
[part="close"]::before {
  transform: rotate(45deg);
}
[part="close"]::after {
  transform: rotate(-45deg);
}
[part="close"]:hover,
[part="close"]:focus,
[part="close"]:active {
  background-color: transparent;
  outline: 0 none;
}
[part="close"]:hover::before,
[part="close"]:hover::after,
[part="close"]:focus::before,
[part="close"]:focus::after,
[part="close"]:active::before,
[part="close"]:active::after  {
  background-color: #888;
}
`;
