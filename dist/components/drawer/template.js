import { makeFragmentTemplate, makeStyleTemplate, } from '../../common/template.js';
import { __bg_base, __fg_base, __transition_duration, __z_index_drawer_base, __z_index_drawer_focus, } from '../../theme/var-light.js';
export const styleTemplate = makeStyleTemplate(`
:host {
  display: none;
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
  font-size: 14px;
}

:host {
  z-index: var(--z-index, var(--bl-z-index-drawer-base, ${__z_index_drawer_base}));
}
:host(:focus-within) {
  z-index: var(--z-index-focus, var(--bl-z-index-drawer-focus, ${__z_index_drawer_focus}));
}

:host([open]) {
  display: block;
}

#layout {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}

#header {
  flex: 0 0 44px;
  display: flex;
  flex-flow: row nowrap;
  height: 44px;
}
#body {
  flex: 1 1 auto;
}
#footer {
  flex: 0 0 auto;
}

#name {
  overflow: hidden;
  white-space: nowrap;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 15px;
  font-size: 16px;
}
#name-prop {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#close {
  flex: 0 0 auto;
  margin: 0 10px 0 0;
  padding: 5px;
  border: none;
  border-radius: 50%;
  background: none;
  fill: #aaa;
}
#close:focus {
  outline: none;
}
#close:hover {
  fill: #888;
}
#close:active {
  fill: #666;
}
#close bl-icon {
  width: 14px;
  height: 14px;
  cursor: pointer;
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
  transition-property: transform;
  transition-duration: var(--transition-duration, ${__transition_duration});
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
}
:host(.openRight-enter-transition-to) ,
:host(.openLeft-enter-transition-to) {
  transform: scale(1, 1);
}
:host(.openRight-leave-transition-from),
:host(.openLeft-leave-transition-from) {
  transform: scale(1, 1);
}
:host(.openRight-leave-transition-to),
:host(.openLeft-leave-transition-to) {
  transform: scale(0, 1);
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
}
:host(.openBottom-enter-transition-to),
:host(.openTop-enter-transition-to) {
  transform: scale(1, 1);
}
:host(.openBottom-leave-transition-from),
:host(.openTop-leave-transition-from) {
  transform: scale(1, 1);
}
:host(.openBottom-leave-transition-to),
:host(.openTop-leave-transition-to) {
  transform: scale(1, 0);
}
`);
export const contentTemplate = makeFragmentTemplate(`
<div id="layout">
<header id="header">
  <div id="name">
    <slot name="name">
      <span id="name-prop"></span>
    </slot>
  </div>
  <button id="close">
    <bl-icon value="cross"></bl-icon>
  </button>
</header>
<div id="body"><slot></slot></div>
<footer id="footer"><slot name="footer"></slot></footer>
</div>
`);
