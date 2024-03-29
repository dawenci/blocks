import {
  __color_primary,
  __color_danger,
  __color_success,
  __color_warning,
  __transition_duration,
  __fg_base,
  __bg_base,
  __radius_base,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: inline-block;
  box-sizing: border-box;
  margin: 8px 28px;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
  transition: all var(--bl-transition-duration, ${__transition_duration}) ease-out;
  border-radius: var(--bl-radius-base, ${__radius_base});
  pointer-events: auto;
  background-color: var(--bl-bg-base, ${__bg_base});
  color: var(--bl-fg-base, ${__fg_base});
}
#layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;  
  width: 100%;
  padding: 12px;
  position: relative;
}
#icon {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  margin: 0 8px 0 0;
}
#icon:empty {
  display: none;
}
#main {
  flex: 1 1 100%;
}
::slotted(h1) {
  margin: 0;
  font-size: 16px;
}
#content {
  line-height: 24px;
  font-size: 14px;
}

[part="close"] {
  --size: 23px;
  --fg: #aaa;
  --shadow-size: 4px;
  flex: 0 0 auto;
  margin: 0 0 0 8px;
}
[part="close"]:hover {
  --fg: #888;
}

:host([type="success"]) {
  background-color: var(--bl-color-success-base, ${__color_success});
  color: #fff;
  fill: #fff;
}
:host([type="success"]) [part="close"] {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
}

:host([type="error"]) {
  background-color: var(--bl-color-danger-base, ${__color_danger});
  color: #fff;
  fill: #fff;
}
:host([type="error"]) [part="close"] {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
}

:host([type="warning"]) {
  background-color: var(--bl-color-warning-base, ${__color_warning});
  color: #fff;
  fill: #fff;
}
:host([type="warning"]) [part="close"] {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
}

:host([type="info"]) {
  background-color: var(--bl-color-primary-base, ${__color_primary});
  color: #fff;
  fill: #fff;
}
:host([type="info"]) [part="close"] {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
}
`
