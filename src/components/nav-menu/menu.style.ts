import {
  __bg_base,
  __border_color_hover,
  __fg_base,
  __font_family,
  __transition_duration,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  box-sizing: border-box;
  font-family: var(--bl-font-family, ${__font_family});
  font-size: 14px;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  transition: height var(--bl-transition-duration, ${__transition_duration});
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
}
:host([horizontal]) {
  width: auto;
  flex-flow: row nowrap;
}
:host(:not([submenu])) {
  border-right: 1px solid var(--bl-border-color-base, ${__border_color_hover});
  border-bottom: none;
}
:host(:not([submenu])[horizontal]) {
  border-bottom: 1px solid var(--bl-border-color-base, ${__border_color_hover});
  border-right: none;
}
:host([submenu][expand]) {
  height: auto;
}
:host([submenu]:not([expand])) {
  overflow: hidden;
  height: 0;
}

/* 垂直模式顶级菜单的折叠模式 */
:host(:not([horizontal]):not([submenu])[collapse]) {
  width: 80px;
  overflow: hidden;
}
`
