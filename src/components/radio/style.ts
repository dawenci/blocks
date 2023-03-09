import {
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __transition_duration,
  __font_size_base,
  __border_color_hover,
  __focus_shadow,
  __color_primary_shadow,
  __fg_base,
  __color_primary_disabled,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  --radio-color: var(--bl-border-color-base, ${__border_color_base});
  --radio-color-hover: var(--bl-border-color-hover, ${__border_color_hover});
  --radio-color-checked: var(--bl-color-primary-base, ${__color_primary});
  --radio-color-hover-checked: var(--bl-color-primary-hover, ${__color_primary_light});
  --radio-color-active-checked: var(--bl-color-primary-active, ${__color_primary_dark});
  --radio-color-disabled: var(--bl-border-color-disabled, ${__border_color_disabled});
  --radio-color-disabled-checked: var(--bl-color-primary-disabled, ${__color_primary_disabled});

  --label-color: var(--bl-fg-base, ${__fg_base});
  --label-color-disabled: var(--bl-fg-disabled, ${__fg_disabled});

  --focus-shadow: var(--bl-focus-shadow, ${__focus_shadow});
  --focus-shadow-checked: var(--bl-color-primary-shadow, ${__color_primary_shadow});

  --duration: var(--transition-duration, ${__transition_duration});
  --font-size: var(--bl-font-size-base, ${__font_size_base});
  --radio-size: 14px;
}
:host {
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
  all: initial;
  contain: content;
  font-size: var(--font-size);
  transition: color var(--duration), border-color var(--duration);
  color: var(--label-color);
}

#layout {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}
#layout:focus {
  outline: none;
}

#radio {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  width: var(--radio-size);
  height: var(--radio-size);
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  border-color: var(--radio-color);
}
:host(:hover) #radio,
:host(:focus) #radio {
  border-color: var(--radio-color-hover);
}
:host(:focus) #radio {
  box-shadow: 0 0 0 2px var(--focus-shadow);
}

:host([checked]) #radio {
  border-color: var(--radio-color-checked);
  background-color: var(--radio-color-checked);
}
:host([checked]:hover) #radio,
:host([checked]:focus) #radio {
  border-color: var(--radio-color-hover-checked);
  background-color: var(--radio-color-hover-checked);
}
:host([checked]) #radio:active {
  border-color: var(--radio-color-active-checked);
  background-color: var(--radio-color-active-checked);
}

:host([checked]:focus) #radio {
  box-shadow: 0 0 0 2px var(--focus-shadow-checked);
}

:host([checked]) #radio::before {
  box-sizing: border-box;
  content: "";
  border: 1px solid #fff;
  width: calc(var(--radio-size) / 3.5);
  height: calc(var(--radio-size) / 3.5);
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  transition: transform var(--duration) ease-in .05s;
  background-color: #fff;
}

#label {
  cursor: default;
  margin-left: 3px;
}

#label.empty {
  display: none;
}

:host([disabled]) {
  color: var(--label-color-disabled);
  outline: 0 none;
}
:host([disabled]) #radio,
:host([disabled]:hover) #radio,
:host([disabled]:active) #radio {
  border-color: var(--radio-color-disabled);
  background-color: var(--radio-color-disabled);
}

:host([disabled][checked]) #radio,
:host([disabled][checked]:hover) #radio,
:host([disabled][checked]:active) #radio {
  border-color: transparent;
  background-color: var(--radio-color-disabled-checked);
  cursor: not-allowed;
}

:host([disabled]) * {
  cursor: not-allowed;
}
`
