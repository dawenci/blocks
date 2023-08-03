import { __color_primary, __color_primary_light, __transition_duration } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  all: initial;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  contain: content;
  transition: color var(--bl-transition-duration, ${__transition_duration}), border-color var(--bl-transition-duration, ${__transition_duration});
  font-size: 0;
}

#layout {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  background-color: rgba(0,0,0,.25);
  cursor: pointer;
}
#layout:focus-visible {
  outline: 0 none;
}

:host(:not([disabled]):hover) #layout,
:host(:not([disabled]):focus) #layout {
  background-color: rgba(0,0,0,.20);
}

#layout:after {
  position: absolute;
  top: 1px;
  left: 1px;
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;
  transition: all var(--bl-transition-duration, ${__transition_duration});
}

:host([checked]) #layout {
  background-color: var(--bl-color-primary-base, ${__color_primary});
}
:host([checked]) #layout:after {
  left: calc(100% - 17px);
}

:host([checked]:not([disabled]):hover) #layout,
:host([checked]:not([disabled]):focus) #layout {
  border-color: transparent;
  background-color: var(--bl-color-primary-hover, ${__color_primary_light});
}

:host([disabled]) {
  opacity: .4;
}
:host([disabled]) * {
  cursor: default;
}

:host([size="small"]) {
  width: 28px;
  height: 16px;
  border-radius: 8px;
}
:host([size="small"]) #layout:after {
  width: 12px;
  height: 12px;
}
:host([size="small"][checked]) #layout:after {
  left: calc(100% - 13px);
}

:host([size="large"]) {
  width: 48px;
  height: 24px;
  border-radius: 12px;
}
:host([size="large"]) #layout:after {
  width: 20px;
  height: 20px;
}
:host([size="large"][checked]) #layout:after {
  left: calc(100% - 22px);
}
`
