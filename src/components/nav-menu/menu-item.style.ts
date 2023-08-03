import {
  __fg_base,
  __fg_hover,
  __fg_active,
  __fg_disabled,
  __fg_placeholder,
  __font_family,
  __height_base,
  __height_large,
  __transition_duration,
  __height_small,
  __color_primary,
  __bg_hover,
  __bg_active,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: block;
  position: relative;
  font-family: var(--bl-font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  user-select: none;
}
#layout {
  box-sizing: box-sizing;
  display: flex;
  justify-content: center;
  align-items: center;
}
#label {
  overflow: hidden;
  flex: 1 1 auto;
  align-items: center;
  white-space: nowrap;
  display: inline;
  text-overflow: ellipsis;
}
#arrow {
  position: relative;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  margin-left: 5px;
  fill: var(--bl-fg-placeholder, ${__fg_placeholder});
  transition: transform var(--bl-transition-duration, ${__transition_duration});
}
#icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
bl-icon {
  display: none;
}
:host(.has-submenu) bl-icon {
  display: inline-block;
}

/* color */
#layout {
  color: var(--bl-fg-base, ${__fg_base});
  fill: var(--bl-fg-base, ${__fg_base});
  cursor: default;
}

:host #layout:hover,
:host(.submenu-open) #layout {
  background-color: var(--bl-bg-hover, ${__bg_hover});
  color: var(--bl-fg-hover, ${__fg_hover});
  fill: var(--bl-fg-hover, ${__fg_hover});
}

:host #layout:active {
  background-color: var(--bl-bg-active, ${__bg_active});
  color: var(--bl-fg-active, ${__fg_active});
  fill: var(--bl-fg-active, ${__fg_active});
}

:host([active]) #layout,
:host([active]) #layout:hover,
:host([active]) #layout:active {
  color: var(--bl-color-primary-base, ${__color_primary});
  fill: var(--bl-color-primary-base, ${__color_primary});
}

:host([link]) #layout {
  cursor: pointer;
}
:host([disabled]) #layout,
:host([disabled]:hover) #layout,
:host([disabled]:active) #layout {
  color: var(--bl-fg-disabled, ${__fg_disabled});
  fill: var(--bl-fg-disabled, ${__fg_disabled});
  cursor: not-allowed;
}

/* 由于子菜单可能 inline，高度设置在 layout，而非 host */
:host([active]) #layout {
  box-shadow: inset -2px 0 0 var(--bl-color-primary-base, ${__color_primary}), 1px 0 0 var(--bl-color-primary-base, ${__color_primary});
}
:host([disabled][active]) #layout {
  box-shadow: inset -2px 0 0 var(--bl-fg-disabled, ${__fg_disabled}), 1px 0 0 var(--bl-fg-disabled, ${__fg_disabled});
}
/*:host-context([horizontal]):host([active]) #layout*/
:host([host-context="horizontal"][active]) #layout {
  box-shadow: inset 0 -2px 0 var(--bl-color-primary-base, ${__color_primary}), 0 1px 0 var(--bl-color-primary-base, ${__color_primary});
}
/*:host-context([horizontal]):host([disabled][active]) #layout*/
:host([host-context="horizontal"][disabled][active]) #layout {
  box-shadow: inset 0 -2px 0 var(--bl-fg-disabled, ${__fg_disabled}), 0 1px 0 var(--bl-fg-disabled, ${__fg_disabled});
}

/*:host-context([horizontal])*/
:host([host-context="horizontal"]) {
  flex: 0 0 auto;
}

/*:host-context([horizontal]) #arrow,
:host-context([inline]) #arrow*/
:host([host-context="horizontal"]) #arrow,
:host([host-context="inline"]) #arrow {
  transform: rotate(90deg);
}

/*:host-context([horizontal]):host(.submenu-open) #arrow,
:host-context([inline]):host([expand]) #arrow*/
:host([host-context="horizontal"].submenu-open) #arrow,
:host([host-context="inline"][expand]) #arrow {
  transform: rotate(-90deg);
}

/*:host-context([collapse]) #label,
:host-context([collapse]) #arrow*/
:host([host-context="collapse"]) #label,
:host([host-context="collapse"]) #arrow {
  display: none;
}

/* size */
:host {
  --height: var(--bl-height-base, ${__height_base});
}
:host-context(bl-nav-menu[size="small"]) {
  --height: var(--bl-height-small, ${__height_small});
}
:host-context(bl-nav-menu[size="large"]) {
  --height: var(--bl-height-large, ${__height_large});
}
#layout {
  height: var(--height);
  padding: 0 12px;
}
:host-context([horizontal]) #layout {
  padding: 0 16px;
}
`
