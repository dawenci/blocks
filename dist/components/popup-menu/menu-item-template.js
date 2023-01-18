import { __fg_base, __fg_hover, __fg_active, __fg_disabled, __fg_placeholder, __font_family, __color_primary, __height_base, __height_small, __height_large, __bg_hover, } from '../../theme/var-light.js';
import { makeDomTemplate, makeStyleTemplate, makeTemplate, } from '../../common/template.js';
export const styleTemplate = makeStyleTemplate(`
:host {
  display: block;
  position: relative;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  color: var(--bl-fg-base, ${__fg_base});
  fill: var(--bl-fg-base, ${__fg_base});
  user-select: none;
  cursor: default;
}

:host(:hover),
:host(.submenu-open) {
  background-color: var(--bl-bg-hover, ${__bg_hover});
  color: var(--bl-fg-hover, ${__fg_hover});
  fill: var(--bl-fg-hover, ${__fg_hover});
}

:host(:active),
:host(.submenu-open:active) {
  background-color: #f0f0f0;
  color: var(--bl-fg-active, ${__fg_active});
  fill: var(--bl-fg-active, ${__fg_active});
}

:host([link]) {
  cursor: pointer;
}
:host([active]),
:host([active]:hover),
:host([active]:active) {
  color: var(--bl-color-primary-base, ${__color_primary});
  fill: var(--bl-color-primary-base, ${__color_primary});
}
:host([disabled]),
:host([disabled]:hover),
:host([disabled]:active) {
  color: var(--bl-fg-disabled, ${__fg_disabled});
  fill: var(--bl-fg-disabled, ${__fg_disabled});
  cursor: not-allowed;
}

#layout {
  display: flex;
  align-items: center;
  height: 100%;
}
#label {
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#arrow {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  margin-left: 5px;
  fill: var(--bl-fg-placeholder, ${__fg_placeholder});
}
#icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
bl-icon {
  display: none;
}
:host(.has-submenu) bl-icon {
  display: inline-block;
}

/* size */
:host {
  height: var(--bl-height-base, ${__height_base});
}
:host-context(bl-popup-menu[size="small"]) {
  height: var(--bl-height-small, ${__height_small});
}
:host-context(bl-popup-menu[size="large"]) {
  height: var(--bl-height-large, ${__height_large});
}
#layout {
  padding: 0 12px;
}
`);
export const contentTemplate = makeTemplate(`
<div id="layout">
  <bl-icon id="icon"></bl-icon>
  <div id="label"></div>
  <bl-icon id="arrow" value="right"></bl-icon>
</div>
`);
export const menuTemplate = makeDomTemplate(document.createElement('bl-popup-menu'));
