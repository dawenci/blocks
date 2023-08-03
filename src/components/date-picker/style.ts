import { __height_base } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  box-sizing: border-box;
  display: inline-block;
  width: calc(var(--bl-height-base, ${__height_base}) * 7 + 10px);
  height: var(--bl-height-base, ${__height_base});
  user-select: none;
  cursor: default;
}
:host(:focus) {
  outline: 0 none;
}
#result {
  width: 100%;
}
`
