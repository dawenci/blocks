import { __transition_duration, __z_index_drawer_base, __z_index_drawer_focus } from '../../theme/var-light.js'

// TODO: 变量化

export const style = /*css*/ `
/* <component>drawer */
:host {
  --radius: 0;
  --z-index: var(--bl-z-index-drawer-base, ${__z_index_drawer_base});
  --z-index-focus: var(--bl-z-index-drawer-focus, ${__z_index_drawer_focus});
}

:host {
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  border: none;
  font-size: 14px;
}

[part="layout"] {
  display: flex;
  flex-flow: column nowrap;
}


[part="header"] {
  flex: 0 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
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
.no-header [part="header"] {
  display: none;
}


[part="body"] {
  box-sizing: border-box;
  flex: 1 1 100%;
  padding: 0 16px;
}
.no-header [part="body"] {
  padding-top: 16px;
}
:host([closeable]) .no-header [part="body"] {
  padding-top: 32px;
}
.no-footer [part="body"] {
  padding-bottom: 16px;
}


[part="footer"] {
  flex: 0 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.no-footer [part="footer"] {
  display: none;
}


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


/* open / close 动画 */
:host(.openLeft-enter-transition-active),
:host(.openLeft-leave-transition-active),
:host(.openRight-enter-transition-active),
:host(.openRight-leave-transition-active),
:host(.openTop-enter-transition-active),
:host(.openTop-leave-transition-active),
:host(.openBottom-enter-transition-active),
:host(.openBottom-leave-transition-active) {
  display: block;
  transition-delay: 0, 0;
  transition-property: transform, opacity;
  transition-duration: var(--bl-transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}

:host(.openLeft-enter-transition-active),
:host(.openLeft-leave-transition-active) {
  transform-origin: left center;
}
:host(.openRight-enter-transition-active),
:host(.openRight-leave-transition-active) {
  transform-origin: right center;
}

:host(.openRight-enter-transition-from),
:host(.openLeft-enter-transition-from) {
  transform: scale(0, 1);
  opacity: 0;
}
:host(.openRight-enter-transition-to) ,
:host(.openLeft-enter-transition-to) {
  transform: scale(1, 1);
  opacity: 1;
}
:host(.openRight-leave-transition-from),
:host(.openLeft-leave-transition-from) {
  transform: scale(1, 1);
  opacity: 1;
}
:host(.openRight-leave-transition-to),
:host(.openLeft-leave-transition-to) {
  transform: scale(0, 1);
  opacity: 0;
}


:host(.openTop-enter-transition-active),
:host(.openTop-leave-transition-active) {
  transform-origin: center top;
}
:host(.openBottom-enter-transition-active),
:host(.openBottom-leave-transition-active) {
  transform-origin: center bottom;
}

:host(.openTop-enter-transition-from),
:host(.openBottom-enter-transition-from) {
  transform: scale(1, 0);
  opacity: 0;
}
:host(.openBottom-enter-transition-to),
:host(.openTop-enter-transition-to) {
  transform: scale(1, 1);
  opacity: 1;
}
:host(.openBottom-leave-transition-from),
:host(.openTop-leave-transition-from) {
  transform: scale(1, 1);
  opacity: 1;
}
:host(.openBottom-leave-transition-to),
:host(.openTop-leave-transition-to) {
  transform: scale(1, 0);
  opacity: 0;
}
`
