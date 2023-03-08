import {
  __bg_base,
  __fg_base,
  __radius_base,
  __z_index_popup_base,
  __z_index_popup_focus,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  box-sizing: border-box;
  position: absolute;
  /* TODO
   https://developers.google.com/web/updates/2016/06/css-containment
   */
  contain: none;
}

:host {
  z-index: var(--z-index, var(--bl-z-index-popup-base, ${__z_index_popup_base}));
}
:host(:focus-within) {
  z-index: var(--z-index-focus, var(--bl-z-index-popup-focus, ${__z_index_popup_focus}));
}

:host([open]) {
  display: block;
}

:host(:focus) {
  outline: 0 none;
}

#layout {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--bl-radius-base, ${__radius_base});
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
}

#arrow {
  overflow: hidden;
  display: block;
  position: absolute;
  /* width, height 留出 5px 投影 */
  width: 24px;
  height: 10px;
  margin: auto;
}
#arrow::after {
  display: block;
  position: absolute;
  top: 5px;
  right: 0;
  bottom: auto;
  left: 0;
  margin: auto;
  content: '';
  width: 10px;
  height: 10px;
  transform: rotate(-45deg);
  background-color: var(--bl-bg-base, ${__bg_base});
}
#arrow::after {
  box-shadow: 0 0 5px rgb(0,0,0,0.06);
}

/* 默认无方向阴影 */
#layout {
  box-shadow: 0 0 5px -4px rgb(0,0,0,0.12),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout, #layout:focus-within {
  outline: 0 none;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
}
.origin-center-center #arrow {
  display: none;
}

/* 箭头指向上方，阴影向下 */
#layout.origin-top-left.vertical,
#layout.origin-top-center,
#layout.origin-top-right.vertical {
  box-shadow: 0 3px 6px -4px rgb(0,0,0,0.12),
    0 6px 16px 0 rgb(0,0,0,0.08),
    0 9px 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-top-left.vertical, #layout:focus-within.origin-top-left.vertical,
:host(:focus-within) #layout.origin-top-center, #layout:focus-within.origin-top-center,
:host(:focus-within) #layout.origin-top-right.vertical, #layout:focus-within.origin-top-right.vertical {
  box-shadow: 0 3px 6px -2px rgb(0,0,0,0.16),
    0 6px 16px 0 rgb(0,0,0,0.08),
    0 9px 28px 8px rgb(0,0,0,0.05);
}
.origin-top-left.vertical #arrow {
  top: -10px;
  left: 10px;
}
.origin-top-center #arrow {
  top: -10px;
  left: 0;
  right: 0;
}
.origin-top-right.vertical #arrow {
  top: -10px;
  right: 10px;
}
/* 箭头指向下方，阴影向上 */
#layout.origin-bottom-left,
#layout.origin-bottom-center,
#layout.origin-bottom-right {
  box-shadow: 0 -3px 6px -4px rgb(0,0,0,0.12),
    0 -6px 16px 0 rgb(0,0,0,0.08),
    0 -9px 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-bottom-right, #layout:focus-within.origin-bottom-right,
:host(:focus-within) #layout.origin-bottom-center, #layout:focus-within.origin-bottom-center,
:host(:focus-within) #layout.origin-bottom-left, #layout:focus-within.origin-bottom-left {
  box-shadow: 0 -3px 6px -2px rgb(0,0,0,0.16),
    0 -6px 16px 0 rgb(0,0,0,0.08),
    0 -9px 28px 8px rgb(0,0,0,0.05);
}
.origin-bottom-left.vertical #arrow {}
/* 未知原因 BUG, 上方多写一行才会生效 */
.origin-bottom-left.vertical #arrow {
  transform: rotate(180deg);
  bottom: -10px;
  left: 10px;
}
.origin-bottom-center #arrow {
  transform: rotate(180deg);
  bottom: -10px;
  left: 0;
  right: 0;
}
.origin-bottom-right.vertical #arrow {
  transform: rotate(180deg);
  bottom: -10px;
  right: 10px;
}
/* 箭头指向左方，阴影向右 */
#layout.origin-center-left,
#layout.origin-top-left.horizontal,
#layout.origin-bottom-left.horizontal {
  box-shadow: 3px 0 6px -4px rgb(0,0,0,0.12),
    6px 0 16px 0 rgb(0,0,0,0.08),
    9px 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-center-left, #layout:focus-within.origin-center-left,
:host(:focus-within) #layout.origin-top-left.horizontal, #layout:focus-within.origin-top-left.horizontal,
:host(:focus-within) #layout.origin-bottom-left.horizontal, #layout:focus-within.origin-bottom-left.horizontal {
  box-shadow: 3px 0 6px -2px rgb(0,0,0,0.16),
    6px 0 16px 0 rgb(0,0,0,0.08),
    9px 0 28px 8px rgb(0,0,0,0.05);
}
.origin-top-left.horizontal #arrow {
  transform: rotate(-90deg);
  top: 10px;
  left: -17px;
}
.origin-center-left #arrow {
  transform: rotate(-90deg);
  top: 0;
  bottom: 0;
  left: -17px;
}
.origin-bottom-left.horizontal #arrow {
  transform: rotate(-90deg);
  bottom: 10px;
  left: -17px;
}
/* 箭头指向右方，阴影向左 */
#layout.origin-center-right,
#layout.origin-top-right.horizontal,
#layout.origin-bottom-right.horizontal {
  box-shadow: -3px 0 6px -4px rgb(0,0,0,0.12),
    -6px 0 16px 0 rgb(0,0,0,0.08),
    -9px 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-center-right, #layout:focus-within.origin-center-right,
:host(:focus-within) #layout.origin-top-right.horizontal, #layout:focus-within.origin-top-right.horizontal,
:host(:focus-within) #layout.origin-bottom-right.horizontal, #layout:focus-within.origin-bottom-right.horizontal {
  box-shadow: -3px 0 6px -2px rgb(0,0,0,0.16),
    -6px 0 16px 0 rgb(0,0,0,0.08),
    -9px 0 28px 8px rgb(0,0,0,0.05);
}
.origin-top-right.horizontal #arrow {
  transform: rotate(90deg);
  top: 10px;
  right: -17px;
}
.origin-center-right #arrow {
  transform: rotate(90deg);
  right: -17px;
  top: 0;
  bottom: 0;
}
.origin-bottom-right.horizontal #arrow {
  transform: rotate(90deg);
  bottom: 10px;
  right: -17px;
}

#first, #last, #first:focus, #last:focus {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}
`
