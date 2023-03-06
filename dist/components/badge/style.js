import { __color_danger, __font_size_small } from '../../theme/var-light.js';
export const style = `
:host {
  --badge-bg: var(--bl-color-danger-base, ${__color_danger});
  --badge-font-size: var(--bl-font-size-small, ${__font_size_small});
}
:host {
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
}
#layout {
  position: relative;
  display: inline-block;
  vertical-align: inherit;
}
#badge {
  box-sizing: border-box;
  overflow: visible;
  display: inline-block;
  vertical-align: top;
  position: relative;
  top: -4px;
  left: -4px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  padding: 0 2px;
  font-size: var(--badge-font-size);
  background-color: var(--badge-bg);
  color: #fff;
}
`;
