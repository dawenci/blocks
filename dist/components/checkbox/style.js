import { __color_primary, __color_primary_light, __color_primary_dark, __fg_disabled, __border_color_base, __border_color_disabled, __transition_duration, __font_size_base, __radius_base, __border_color_hover, __focus_shadow, __color_primary_shadow, __fg_base, __color_primary_disabled, } from '../../theme/var-light.js';
export const style = `
:host {
  --checkbox-color: var(--bl-border-color-base, ${__border_color_base});
  --checkbox-color-hover: var(--bl-border-color-hover, ${__border_color_hover});
  --checkbox-color-checked: var(--bl-color-primary-base, ${__color_primary});
  --checkbox-color-hover-checked: var(--bl-color-primary-hover, ${__color_primary_light});
  --checkbox-color-active-checked: var(--bl-color-primary-active, ${__color_primary_dark});
  --checkbox-color-disabled: var(--bl-border-color-disabled, ${__border_color_disabled});
  --checkbox-color-disabled-checked: var(--bl-color-primary-disabled, ${__color_primary_disabled});

  --focus-shadow: var(--bl-focus-shadow, ${__focus_shadow});
  --focus-shadow-checked: var(--bl-color-primary-shadow, ${__color_primary_shadow});

  --label-color: var(--bl-fg-base, ${__fg_base});
  --label-color-disabled: var(--bl-fg-disabled, ${__fg_disabled});

  --duration: var(--transition-duration, ${__transition_duration});
  --font-size: var(--bl-font-size-base, ${__font_size_base});
  --radius: var(--bl-radius-base, ${__radius_base});
  --size: 14px;
}
:host {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
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

#checkbox {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: var(--size);
  height: var(--size);
  border-width: 1px;
  border-style: solid;
  border-color: var(--checkbox-color);
  border-radius: var(--radius);
  cursor: pointer;
}

:host(:focus) #checkbox,
:host(:focus-within) #checkbox {
  box-shadow: 0 0 0 2px var(--focus-shadow);
}

:host(:hover) #checkbox,
:host(:focus) #checkbox {
  border-color: var(--checkbox-color-hover);
}

/* 选中状态、不确定状态，框线、背景高亮 */
:host([checked]) #checkbox,
:host #checkbox[indeterminate],
:host #checkbox[indeterminate] {
  border-color: var(--checkbox-color-checked);
  background-color: var(--checkbox-color-checked);
}

/* 选中状态、不确定状态，hover、foucs 高光高亮 */
:host(:hover) #checkbox[indeterminate],
:host(:focus) #checkbox[indeterminate],
:host([checked]:hover) #checkbox,
:host([checked]:focus) #checkbox {
  border-color: var(--checkbox-color-hover-checked);
  background-color: var(--checkbox-color-hover-checked);
}

/* 激活状态，加深高亮 */
:host([checked]:active) #checkbox,
:host(:active) #checkbox[indeterminate] {
  border-color: var(--checkbox-color-active-checked);
  background-color: var(--checkbox-color-active-checked);
}

/* 不确定状态，内部渲染横杠 */
:host #checkbox[indeterminate]::before {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(.5);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

/* 选中状态，内部渲染对勾 */
:host([checked]) #checkbox::before {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  width: calc(var(--size) / 4);
  height: calc(var(--size) / 2);
  position: absolute;
  top: 0;
  right: 0;
  bottom: calc(var(--size) / 7);
  left: 0;
  margin: auto;
  transform: rotate(45deg) scaleY(0);
  transition: transform .15s ease-in .05s;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
}

:host(:focus) #checkbox[indeterminate],
:host([checked]:focus) #checkbox {
  box-shadow: 0 0 0 2px var(--focus-shadow-checked);
}

#label {
  display: inline-block;
  cursor: default;
  margin-left: 3px;
}

#label.empty {
  display: none;
}

:host([disabled]) {
  color: var(--label-color-disabled);
}
:host([disabled]) #checkbox,
:host([disabled]:hover) #checkbox,
:host([disabled]:active) #checkbox,
:host([disabled]:focus) #checkbox {
  border-color: var(--checkbox-color-disabled);
  background-color: var(--checkbox-color-disabled);
}

:host([disabled][checked]) #checkbox,
:host([disabled][checked]:hover) #checkbox,
:host([disabled][checked]:active) #checkbox,
:host([disabled][checked]:focus) #checkbox {
  border-color: transparent;
  background-color: var(--checkbox-color-disabled-checked);
  cursor: not-allowed;
}

:host([disabled]) * {
  cursor: not-allowed;
}
`;
