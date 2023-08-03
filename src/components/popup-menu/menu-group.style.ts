import { __fg_secondary, __font_family } from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: block;
  margin: 10px 0;
  font-family: var(--bl-font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px 0;
  font-weight: 500;
  font-size: 12px;
  color: var(--bl-fg-secondary, ${__fg_secondary});
  cursor: default;
}
`
