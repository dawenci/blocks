import {
  __border_color_base,
  __color_primary,
  __color_primary_light,
  __z_index_popup_base,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  --bg: var(--bl-color-primary-base, ${__color_primary});
  --bg-hover: var(--bl-color-primary-hover, ${__color_primary_light});
  --z-index: var(--bl-z-index-popup-base, ${__z_index_popup_base});
}
:host {
  box-sizing: border-box;
  position: fixed;
  z-index: var(--z-index);
  bottom: 50px;
  right: 20px;
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg);
  color: #fff;
  font-family: sans-serif;
  font-size: 14px;
  cursor: pointer;  
}
:host(:hover) {
  background-color: var(--bg-hover);
}
#layout {
  width: 100%;
  height: 100%;
  position: relative;
}
#icon {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 14px;
  height: 20px;
  border-top: 1px solid var(--bl-border-color-base, ${__border_color_base});
}
#icon::before,
#icon::after {
  position: absolute;
  content: '';
  margin: auto;
  right: 0;
  left: 0;
}
#icon::before {
  width: 8px;
  height: 8px;
  top: 6px;
  transform: rotate(-45deg);
  border-top: 1px solid var(--bl-border-color-base, ${__border_color_base});
  border-right: 1px solid var(--bl-border-color-base, ${__border_color_base});
}
#icon::after {
  top: 8px;
  width: 1px;
  height: 8px;
  background-color: var(--bl-border-color-base, ${__border_color_base});
}
`
