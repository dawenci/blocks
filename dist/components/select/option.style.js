import { useColorWithOpacity } from '../../common/color.js';
import { __color_primary, __color_primary_light } from '../../theme/var-light.js';
export const style = `
:host {
  display: block;
  box-sizing: border-box;
  line-height: 1.5;
  padding: 4px 10px;
  cursor: default;
  font-size: 12px;
}
:host-context(bl-optgroup) {
  padding: 4px 10px 4px 2em;
}
:host(:focus) {
  outline: 1px solid ${useColorWithOpacity(__color_primary, 0.3)};
  background: ${useColorWithOpacity(__color_primary, 0.1)};
}
:host([selected]) {
  background-color: var(--bl-color-primary-base, ${__color_primary});
  color: #fff;
}
:host([selected]:hover) {
  background-color: var(--bl-color-primary-hover, ${__color_primary_light});
  color: #fff;
}
:host-context(bl-optgroup[disabled]),
:host([disabled]) {
  color: #ccc;
  cursor: not-allowed;
}
:host(:hover) {
  background-color: #f0f0f0;
}
:host-context(bl-optgroup[disabled]:hover),
:host([disabled]:hover) {
  background-color: transparent;
}
`;
