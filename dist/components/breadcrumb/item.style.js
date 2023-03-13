import { __color_primary_dark, __color_primary_light } from '../../theme/var-light.js';
export const style = `
:host {
  box-sizing: border-box;
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  vertical-align: middle;
}

#link {
  white-space: nowrap;
  cursor: default;
  text-decoration: none;
}
#link[href] {
  cursor: pointer;
}
#link[href]:link,
#link[href]:visited {
  color: inherit;
}
#link[href]:hover {
  color: var(--bl-color-primary-hover, ${__color_primary_light});
}
#link[href]:active {
  color: var(--bl-color-primary-active, ${__color_primary_dark});
}

#separator:empty {
  display: none;
}
#separator {
  margin: 0 8px;
  white-space: nowrap;
  user-select: none;
  opacity: .5;
}
`;
