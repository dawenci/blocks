import { __border_color_hover, __fg_secondary, __font_family } from '../../theme/var-light.js';
export const style = `
:host {
  display: block;
  font-family: var(--bl-font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px;
  border-bottom: 1px solid var(--bl-border-color-hover, ${__border_color_hover});
  font-weight: 700;
  color: var(--bl-fg-secondary, ${__fg_secondary});
}
`;
