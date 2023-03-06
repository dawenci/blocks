import {
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __color_danger,
  __color_danger_light,
  __color_danger_dark,
  __color_success,
  __color_success_light,
  __color_success_dark,
  __color_warning,
  __color_warning_light,
  __color_warning_dark,
  __color_primary_shadow,
  __color_danger_shadow,
  __color_success_shadow,
  __color_warning_shadow,
  __color_primary_disabled,
  __color_danger_disabled,
  __color_success_disabled,
  __color_warning_disabled,
} from '../../theme/var-light.js'

export const style = /*css*/ `
/* <component>button */
/* 变量 */
:host([type="primary"]) {
  --bg: var(--bl-color-primary-base, ${__color_primary});
  --bg-hover: var(--bl-color-primary-hover, ${__color_primary_light});
  --bg-active: var(--bl-color-primary-active, ${__color_primary_dark});
  --bg-disabled: var(--bl-color-primary-disabled, ${__color_primary_disabled});
  --border-color: var(--bl-color-primary-base, ${__color_primary});
  --border-color-hover: var(--bl-color-primary-hover, ${__color_primary_light});
  --border-color-active: var(--bl-color-primary-base, ${__color_primary});
  --border-color-disabled: var(--bl-color-primary-disabled, ${__color_primary_disabled});
  --focus-shadow: var(--bl-color-primary-shadow, ${__color_primary_shadow});
}
:host([type="danger"]) {
  --bg: var(--bl-color-danger-base, ${__color_danger});
  --bg-hover: var(--bl-color-danger-hover, ${__color_danger_light});
  --bg-active: var(--bl-color-danger-active, ${__color_danger_dark});
  --bg-disabled: var(--bl-color-danger-disabled, ${__color_danger_disabled});
  --border-color: var(--bl-color-danger-base, ${__color_danger});
  --border-color-hover: var(--bl-color-danger-hover, ${__color_danger_light});
  --border-color-active: var(--bl-color-danger-active, ${__color_danger_dark});
  --border-color-disabled: var(--bl-color-danger-disabled, ${__color_danger_disabled});
  --focus-shadow: var(--bl-color-danger-shadow, ${__color_danger_shadow});
}
:host([type="success"]) {
  --bg: var(--bl-color-success-base, ${__color_success});
  --bg-hover: var(--bl-color-success-hover, ${__color_success_light});
  --bg-active: var(--bl-color-success-active, ${__color_success_dark});
  --bg-disabled: var(--bl-color-success-disabled, ${__color_success_disabled});
  --border-color: var(--bl-color-success-base, ${__color_success});
  --border-color-hover: var(--bl-color-success-hover, ${__color_success_light});
  --border-color-active: var(--bl-color-success-active, ${__color_success_dark});
  --border-color-disabled: var(--bl-color-success-disabled, ${__color_success_disabled});
  --focus-shadow: var(--bl-color-success-shadow, ${__color_success_shadow});
}
:host([type="warning"]) {
  --bg: var(--bl-color-warning-base, ${__color_warning});
  --bg-hover: var(--bl-color-warning-hover, ${__color_warning_light});
  --bg-active: var(--bl-color-warning-active, ${__color_warning_dark});
  --bg-disabled: var(--bl-color-warning-disabled, ${__color_warning_disabled});
  --border-color: var(--bl-color-warning-base, ${__color_warning});
  --border-color-hover: var(--bl-color-warning-hover, ${__color_warning_light});
  --border-color-active: var(--bl-color-warning-active, ${__color_warning_dark});
  --border-color-disabled: var(--bl-color-warning-disabled, ${__color_warning_disabled});
  --focus-shadow: var(--bl-color-warning-shadow, ${__color_warning_shadow});
}
:host([type="primary"]),
:host([type="danger"]),
:host([type="success"]),
:host([type="warning"]) {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
  --fg-disabled: #fff;
  --icon-opacity: 1;
  --icon-opacity-hover: 1;
  --icon-opacity-active: 1;
  --icon-opacity-disabled: 1;
}

:host([type="primary"][outline]) {
  --fg: var(--bl-color-primary-base, ${__color_primary});
  --fg-hover: var(--bl-color-primary-hover, ${__color_primary_light});
  --fg-active: var(--bl-color-primary-active, ${__color_primary_dark});
  --fg-disabled: var(--bl-color-primary-disabled, ${__color_primary_disabled});
}
:host([type="danger"][outline]) {
  --fg: var(--bl-color-danger-base, ${__color_danger});
  --fg-hover: var(--bl-color-danger-hover, ${__color_danger_light});
  --fg-active: var(--bl-color-danger-active, ${__color_danger_dark});
  --fg-disabled: var(--bl-color-danger-disabled, ${__color_danger_disabled});
}
:host([type="success"][outline]) {
  --fg: var(--bl-color-success-base, ${__color_success});
  --fg-hover: var(--bl-color-success-hover, ${__color_success_light});
  --fg-active: var(--bl-color-success-active, ${__color_success_dark});
  --fg-disabled: var(--bl-color-success-disabled, ${__color_success_disabled});
}
:host([type="warning"][outline]) {
  --fg: var(--bl-color-warning-base, ${__color_warning});
  --fg-hover: var(--bl-color-warning-hover, ${__color_warning_light});
  --fg-active: var(--bl-color-warning-active, ${__color_warning_dark});
  --fg-disabled: var(--bl-color-warning-disabled, ${__color_warning_disabled});
}
:host([type="link"]) {
  --border-color: transparent;
  --bg: transparent;
  --fg: var(--bl-color-primary-base, ${__color_primary});
  --fg-hover: var(--bl-color-primary-hover, ${__color_primary_light});
  --fg-active: var(--bl-color-primary-hover, ${__color_primary_dark});
  --fg-disabled: var(--bl-color-primary-disabled, ${__color_primary_disabled});
}

:host([disabled][disabled]) {
  --bg: var(--bg-disabled);
  --bg-hover: var(--bg-disabled);
  --bg-active: var(--bg-disabled);
  --fg: var(--fg-disabled);
  --fg-hover: var(--fg-disabled);
  --fg-active: var(--fg-disabled);
  --border-color: var(--border-color-disabled);
  --border-color-hover: var(--border-color-disabled);
  --border-color-active: var(--border-color-disabled);
}
:host([outline][outline]) {
  --bg: transparent;
  --bg-hover: transparent;
  --bg-active: transparent;
}
:host([type="link"][type="link"]) {
  --bg: transparent;
  --bg-hover: transparent;
  --bg-active: transparent;
  --border-color: transparent;
  --bl-border-color-hover: transparent;
  --bl-border-color-active: transparent;
}
:host([round]) {
  --radius: calc(var(--height) / 2);
}

/* 样式应用 */
:host {
  height: var(--height);
  user-select: none;
  text-align: center;
  cursor: pointer;
}
:host([block]) {
  display: block;
}
:host([hidden]) {
  display: none;
}

/*  纯图标 */
#layout.empty {
  overflow: hidden;
  width: var(--height);
  padding-left: 0;
  padding-right: 0;
}
#layout.empty #content {
  padding-left: 0;
  padding-right: 0;
}

#content {
  flex: 0 0 auto;
  display: block;
  height: 100%;
  padding: 0 var(--padding);
  line-height: calc(var(--height) - 2px);
  box-sizing: border-box;
  white-space: nowrap;
}
.with-prefix #content,
.with-loading #content {
  padding-left: calc(var(--padding) - 2px);
}
.with-suffix #content,
.with-clear #content {
  padding-right: calc(var(--padding) - 2px);
}

/* button group */
/*:host-context(bl-button-group),*/
:host([group-context]) {
  position: relative;
  vertical-align: top;
}
/*:host(:hover):host-context(bl-button-group),
:host(:focus-within):host-context(bl-button-group),*/
:host([group-context]:hover),
:host([group-context]:focus-within) {
  z-index: 1;
}
/*:host(:not(:first-of-type)):host-context(bl-button-group),*/
:host([group-context]:not(:first-of-type)) {
  margin-left: -1px;
}
/*:host-context(bl-button-group),*/
:host([group-context]) {
  border-radius: 0;
}
/*:host(:first-of-type):host-context(bl-button-group),*/
:host([group-context]:first-of-type) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
/*:host(:last-of-type):host-context(bl-button-group),*/
:host([group-context]:last-of-type) {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
`
