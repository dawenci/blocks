import { __transition_duration, __radius_base, __font_size_base, __fg_base, __fg_active, __fg_hover, __border_color_base, __border_color_hover, __border_color_active, __height_base, __height_small, __height_large, __font_size_small, __font_size_large, __fg_disabled, __border_color_disabled, __bg_disabled, __bg_hover, __bg_active, __bg_base, __radius_small, __radius_large, __focus_shadow, } from '../../theme/var-light.js';
export const style = `
/* <component>base-control-box */
/* 变量 */
:host {
--bg-base: var(--bl-bg-base, ${__bg_base});
--bg-hover: var(--bl-bg-hover, ${__bg_hover});
--bg-active: var(--bl-bg-active, ${__bg_active});
--bg-disabled: var(--bl-bg-disabled, ${__bg_disabled});
--bg: var(--bg-base);

--fg-base: var(--bl-fg-base, ${__fg_base});
--fg-hover: var(--bl-fg-hover, ${__fg_hover});
--fg-active: var(--bl-fg-active, ${__fg_active});
--fg-disabled: var(--bl-fg-disabled, ${__fg_disabled});
--fg: var(--fg-base);

--border-color-base: var(--bl-border-color-base, ${__border_color_base});
--border-color-hover: var(--bl-border-color-hover, ${__border_color_hover});
--border-color-active: var(--bl-border-color-active, ${__border_color_active});
--border-color-disabled: var(--bl-border-color-disabled, ${__border_color_disabled});
--border-color: var(--border-color-base);

--focus-shadow: var(--bl-focus-shadow, ${__focus_shadow});

--icon-opacity: .5;
--icon-opacity-hover: .75;
--icon-opacity-active: 1;
--icon-opacity-disabled: 0.5;
--icon-opacity-focus: .75;

--height: var(--bl-height-base, ${__height_base});
--height-small: var(--bl-height-small, ${__height_small});
--height-large: var(--bl-height-large, ${__height_large});

--padding: 8px;
--padding-small: 6px;
--padding-large: 12px;

--icon-size: 16px;
--icon-size-small: 16px;
--icon-size-large: 18px;

--radius: var(--bl-radius-base, ${__radius_base});
--radius-small: var(--bl-radius-small, ${__radius_small});
--radius-large: var(--bl-radius-large, ${__radius_large});

--font-size: var(--bl-font-size-base, ${__font_size_base});
--font-size-small: var(--bl-font-size-small, ${__font_size_small});
--font-size-large: var(--bl-font-size-large, ${__font_size_large});

--duration: var(--transition-duration, ${__transition_duration});
}

:host([size="small"]) {
--height: var(--height-small);
--padding: var(--padding-small);
--icon-size: var(--icon-size-small);
--font-size: var(--font-size-small);
}
:host([size="large"]) {
--height: var(--height-large);
--padding: var(--padding-large);
--icon-size: var(--icon-size-large);
--font-size: var(--font-size-large);
}
:host(:focus),
:host(:focus-within),
:host(:focus-visible) {
--bg: var(--bg-hover);
--fg: var(--fg-hover);
--border-color: var(--border-color-hover);
--icon-opacity: var(--icon-opacity-focus);
}
:host(:hover) {
--bg: var(--bg-hover);
--fg: var(--fg-hover);
--border-color: var(--border-color-hover);
--icon-opacity: var(--icon-opacity-hover);
}
:host(:active) {
--bg: var(--bg-active);
--fg: var(--fg-active);
--border-color: var(--border-color-active);
--icon-opacity: var(--icon-opacity-active);
}
:host([disabled]),
:host([disabled]):hover,
:host([disabled]):focus,
:host([disabled]):active {
--bg: var(--bg-disabled);
--fg: var(--fg-disabled);
--border-color: var(--border-color-disabled);
--icon-opacity: var(--icon-opacity-disabled);
}

/* 样式设置 */
:host {
box-sizing: border-box;
overflow: hidden;
display: inline-block;
cursor: default;
color: var(--fg);
background-color: var(--bg);
border: 1px solid var(--border-color);
border-radius: var(--radius);
font-size: var(--font-size);
transition: color var(--duration), background-color var(--duration), border-color var(--duration);
}
:host(:focus),
:host(:focus-within) {
outline: 0 none;
box-shadow: 0 0 0 2px var(--focus-shadow);
}

:host([disabled]),
:host([disabled]):hover,
:host([disabled]):focus,
:host([disabled]):active {
outline: 0 none;
cursor: not-allowed;
}

#layout {
box-sizing: border-box;
display: flex;
flex-flow: row nowrap;
justify-content: center;
align-items: center;
position: relative;
width: 100%;
height: 100%;
text-align: inherit;
}
#layout:focus-visible {
  outline: 0 none;
}
.with-loading {
padding-left: var(--padding);
}
.with-prefix {
padding-left: var(--padding);
}
.with-suffix {
padding-right: var(--padding);
}
#layout:focus {
outline: 0 none;
}

#loading,
#prefix,
#suffix {
box-sizing: border-box;
flex: 0 0 auto;
display: block;
position: relative;
width: var(--icon-size);
height: var(--icon-size);
color: var(--fg);
fill: var(--fg);
transition: transform var(--duration), opacity var(--duration);
opacity: var(--icon-opacity);
}
#loading svg,
#prefix svg,
#suffix svg {
width: 100%;
height: 100%;
}
#loading {
position: relative;
animation: 1s linear infinite rotate360;
}
#loading + #prefix {
visibility: hidden;
}
.with-prefix #loading {
position: absolute;
top: 0;
right: auto;
bottom: 0;
left: var(--padding);
margin: auto;
}

#content {
box-sizing: border-box;
flex: 1 1 100%;
overflow: hidden;
position: relative;
text-align: inherit;
}

@keyframes rotate360 {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}
`;
