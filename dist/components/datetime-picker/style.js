import { __height_base } from '../../theme/var-light.js';
export const style = `
:host {
  box-sizing: border-box;
  display: inline-block;
  width: calc(var(--bl-height-base, ${__height_base}) * 7 + 10px);
  height: var(--bl-height-base, ${__height_base});
  user-select: none;
  cursor: default;
}

[part="result"] {
  width: 100%;
}
`;
