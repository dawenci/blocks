import { __height_base } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: inline-block;
  box-sizing: border-box;
  width: calc(var(--bl-height-base, ${__height_base}) * 7 + 10px);
  height: 32px;
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
