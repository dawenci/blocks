import { __padding_large, __z_index_dialog_base, __z_index_dialog_focus } from '../../theme/var-light.js';
export const style = `
/* <component>dialog */
:host {
  --padding: var(--bl-padding-large, ${__padding_large});
  --z-index: var(--bl-z-index-dialog-base, ${__z_index_dialog_base});
  --z-index-focus: var(--bl-z-index-dialog-focus, ${__z_index_dialog_focus});  
}

:host {
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 20px);
}


/* 对话框 */
[part="layout"] {
  display:flex;
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
  --size: 32px;
  position:absolute;
  z-index: 1;
  right:5px;
  top:5px;
  opacity: .7;
}
[part="close"]:hover,
[part="close"]:focus {
  opacity: .8;
}
[part="close"]:active {
  opacity: 1;
}
`;
