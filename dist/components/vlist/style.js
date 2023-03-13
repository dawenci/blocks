import { __transition_duration, __height_base, __fg_base } from '../../theme/var-light.js';
export const style = `
/* <component>vlist */
:host {
  --item-height: var(--bl-height-base, ${__height_base});
}
:host {
  display: block;
  box-sizing: border-box;
  contain: content;
}

#viewport {
  box-sizing: border-box;
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#list-size {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
#list {
  display: flex;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}
:host(:not([direction="horizontal"])) #list {
  flex-flow: column nowrap;
}
:host([direction="horizontal"]) #list {
  flex-flow: row nowrap;
}

#list > div {
  flex: 0 0 auto;
  box-sizing: border-box;
  position: relative;
  cursor: default;
}

#loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255,255,255,.8);
  pointer-events: none;
}
#loading bl-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 28px;
  height: 28px;
  margin: auto;
  fill: var(--bl-fg-base, ${__fg_base});
}

.collapse-enter-transition-active,
.collapse-leave-transition-active {
  display: block;
  overflow: hidden;
  transition-delay: 0, 0;
  transition-property: opacity, height;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}
.collapse-enter-transition-from,
.collapse-leave-transition-to {
  opacity: 1 !important;
  /* height 使用 js 设置 */
}
.collapse-enter-transition-to,
.collapse-leave-transition-from {
  opacity: 0 !important;
  height: 0 !important;
}
`;
