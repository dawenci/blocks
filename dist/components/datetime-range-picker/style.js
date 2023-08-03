import { __height_base } from '../../theme/var-light.js';
export const style = `
:host {
  box-sizing: border-box;
  display: inline-block;
  width: calc(var(--bl-height-base, ${__height_base}) * 10 + 10px);
  height: var(--bl-height-base, ${__height_base});
  user-select: none;
  cursor: default;
}

:host(:focus),
:host(:focus-within),
:host(:hover) {
  --fg: var(--fg-base);
  --bg: var(--bg-base);
}

[part="result"] {
  width: 100%;
}
`;
