import { makeStyleTemplate, makeTemplate } from '../../common/template.js';
export const styleTemplate = makeStyleTemplate(`
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
`);
export const inputTemplate = makeTemplate(`
<input part="input" id="content" class="input" />
`);
