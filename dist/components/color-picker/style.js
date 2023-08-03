import { __height_base, __height_large, __height_small, __transition_duration } from '../../theme/var-light.js';
export const style = `
:host {
  display: inline-block;
  box-sizing: border-box;
  width: var(--bl-height-base, ${__height_base});
  height: var(--bl-height-base, ${__height_base});
  user-select: none;
  cursor: default;
  position: relative;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) repeat;

  --duration: var(--bl-transition-duration, ${__transition_duration});
}
:host(:focus),
:host(:focus-within) {
  outline: 0 none;
}

:host([disabled]) #layout,
:host([disabled]) bl-icon {
  cursor: not-allowed;
}

:host([size="small"]) {
  width: var(--bl-height-small, ${__height_small});
  height: var(--bl-height-small, ${__height_small});
}
:host([size="large"]) {
  width: var(--bl-height-large, ${__height_large});
  height: var(--bl-height-large, ${__height_large});
}

bl-select-result {
  border: 0 none;
}
bl-select-result.dropdown::part(suffix) {
  transform: rotate(180deg);
}
`;
