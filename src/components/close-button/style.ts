import {
  __height_base,
  __fg_base,
  __fg_hover,
  __fg_active,
  __transition_duration,
  __focus_shadow,
} from '../../theme/var-light.js'

export const style = /*css*/ `
/* <component>close-button */
:host {
  --size: var(--bl-height-base, ${__height_base});
  --line-width: 1px;
  --border-width: 1px;
  --padding: 4px;
  --shadow-size: 7px;
  --bg: transparent;
  --bg-hover: transparent;
  --bg-active: transparent;
  --fg: var(--bl-fg-base, ${__fg_base});
  --fg-hover: var(--bl-fg-hover, ${__fg_hover});
  --fg-active: var(--bl-fg-active, ${__fg_active});
  --duration: var(--bl-transition-duration, ${__transition_duration});
  --focus-shadow: var(--bl-focus-shadow, ${__focus_shadow});
}

:host {
  box-sizing: border-box;
  width: var(--size);
  height: var(--size);
  padding: var(--shadow-size);
  transition: all var(--duration);
  border-radius: 50%;
  overflow: hidden;
  cursor: default;
}
:host(:focus) [part="layout"],
:host(:focus-within) [part="layout"],
:host(:hover) [part="layout"] {
  outline: 0 none;
  box-shadow: 0 0 0 var(--shadow-size) var(--focus-shadow);
}

[part="layout"] {
  box-sizing: border-box;
  width: calc(var(--size) - calc(var(--shadow-size) * 2));
  height: calc(var(--size) - calc(var(--shadow-size) * 2));
  position: relative;
  border-radius: 50%;
  transform: rotate(45deg);
  border-width: var(--border-width);
  border-style: solid;
  border-color: var(--fg);
  background-color: var(--bg);
  transition: all var(--duration);
}
[part="layout"]:focus,
[part="layout"]:hover {
  border-color: var(--fg-hover);
  background-color: var(--bg-hover);
}

[part="layout"]:active {
  border-color: var(--fg-active);
  background-color: var(--bg-active);
}

[part="layout"]::before,
[part="layout"]::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: var(--line-width);
  height: var(--line-width);
  margin: auto;
  background-color: var(--fg);
}
[part="layout"]::before {
  width: calc(var(--size) - calc(calc(var(--padding) + var(--shadow-size)) * 2));
}
[part="layout"]::after {
  height:  calc(var(--size) - calc(calc(var(--padding) + var(--shadow-size)) * 2));
}

[part="layout"]:focus::before,
[part="layout"]:focus::after,
[part="layout"]:hover::before,
[part="layout"]:hover::after {
  background-color: var(--fg-hover);
}

[part="layout"]:active::before,
[part="layout"]:active::after {
  background-color: var(--fg-active);
}
`
