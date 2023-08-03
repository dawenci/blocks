export const style = `
/* <component>input */
:host(:focus:not([disabled])),
:host(:focus-within:not([disabled])),
:host(:hover:not([disabled])) {
  --fg: var(--fg-base);
  --bg: var(--bg-base);
}

:host {
  height: var(--height);
}

::placeholder {
  color: var(--bl-fg-placeholder);
}

#content {
  flex: 1 1 100%;
  width: 100%;
  height: 100%;
  font-size: inherit;
  padding: 0 var(--padding);
  border: 0 none;
  line-height: 1;
  background: transparent;
  color: inherit;
}
:host([disabled]) #content {
  cursor: default;
}

.with-prefix #content,
.with-loading #content {
  padding-left: calc(var(--padding) - 2px);
}
.with-suffix #content,
.with-clear #content {
  padding-right: calc(var(--padding) - 2px);
}

#content:focus {
  outline: 0 none;
}
`;
