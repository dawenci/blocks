export const style = `
/* <component>base-clearable-control-box */
:host {
  --layout-padding: var(--padding);
}

.with-clear {
  padding-right: var(--padding);
}

[part="clear"] {
  --size: calc(var(--icon-size) + 4px);
  --shadow-size: 2px;
  flex: 0 0 auto;
  position: relative;
  right: -2px;
  pointer-events: none;
  opacity: 0;
}
[part="clear"]:focus {
  outline: 0 none;
}
.with-suffix [part="clear"] {
  position: absolute;
  top: 0;
  right: calc(var(--layout-padding) - 2px);
  bottom: 0;
  left: auto;
  margin: auto;
}
:host([clearable]:hover) #layout:not(.empty) [part="clear"] {
  pointer-events: auto;
}

:host([clearable]:focus-within) #layout:not(.empty) [part="clear"],
:host([clearable]:hover) #layout:not(.empty) [part="clear"] {
  opacity: var(--icon-opacity-base);
}
:host([clearable]) #layout:not(.empty) [part="clear"]:focus,
:host([clearable]:hover) #layout:not(.empty) [part="clear"]:hover {
  opacity: var(--icon-opacity-hover);
}
:host([clearable]:hover) #layout:not(.empty) [part="clear"]:active {
  opacity: var(--icon-opacity-active);
}

:host([clearable]:focus-within) #layout:not(.empty) #suffix,
:host([clearable]:hover) #layout:not(.empty) #suffix {
  opacity: 0;
  pointer-events: none;
}

`;
