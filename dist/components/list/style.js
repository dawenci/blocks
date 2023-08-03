import { __color_primary, __fg_disabled, __transition_duration, __fg_base, __color_danger, __bg_hover, __fg_hover, __font_size_base, __bg_base, __bg_active, __fg_active, __bg_disabled, __border_color_hover, __border_color_active, __focus_shadow, __border_color_base, } from '../../theme/var-light.js';
export const style = `
:host {
  --item-bg-base: var(--bl-bg-base, ${__bg_base});
  --item-bg-hover: var(--bl-bg-hover, ${__bg_hover});
  --item-bg-active: var(--bl-bg-active, ${__bg_active});
  --item-bg-disabled: var(--bl-bg-disabled, ${__bg_disabled});

  --item-fg-base: var(--bl-fg-base, ${__fg_base});
  --item-fg-hover: var(--bl-fg-hover, ${__fg_hover});
  --item-fg-active: var(--bl-fg-active, ${__fg_active});
  --item-fg-disabled: var(--bl-fg-disabled, ${__fg_disabled});

  --item-border-color-base: var(--bl-border-color-base, ${__border_color_base});
  --item-border-color-hover: var(--bl-border-color-hover, ${__border_color_hover});
  --item-border-color-active: var(--bl-border-color-active, ${__border_color_active});
  --item-border-color-disabled: transparent;

  --bg-stripe: var(--bl-bg-hover, ${__bg_hover});
  --font-size: var(--bl-font-size-base, ${__font_size_base});
  --duration: var(--bl-transition-duration, ${__transition_duration});    
}

:host {
  box-sizing: border-box;
  display: block;
  contain: content;
  transition: color var(--duration), border-color var(--duration);
  font-size: var(--font-size);
}

#viewport:focus,
#viewport:focus-visible {
  outline: 0 none;
}

.item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  height: var(--item-height);
  border-color: var(--item-border-color-base);
  background-color: var(--bg-base);
  color: var(--fg-base);
}

:host([stripe]) .item:nth-child(even) {
  --bg-base: var(--bg-stripe);
}

.item.focus,
.item:focus {
  z-index: 2;
  color: var(--item-fg-hover);
  background-color: var(--item-bg-hover);
  outline: 0 none;
  box-shadow: 0 0 0 2px var(--bl-focus-shadow, ${__focus_shadow});
}

.item:hover {
  z-index: 1;
  color: var(--item-fg-hover);
  background-color: var(--item-bg-hover);
}

.item:active {
  color: var(--item-fg-active);
  background-color: var(--item-bg-active);
}

/* border */
.item:before,
.item:after {
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: 0;
  display: block;
  content: '';
  height: 1px;
  transform: scale(1, 0.5);
}
.item:before {
  top: -0.5px;
}
.item:after {
  bottom: -0.5px;
}
.item:first-child:before,
.item:last-child:after {
  display: none;
}
:host([border]) .item:before,
:host([border]) .item:after {
  background-color: var(--item-border-color-base);
}
:host([border]) .item:focus::before,
:host([border]) .item:focus::after {
  background-color: var(--item-border-color-hover);
}
:host([border]) .item:hover::before,
:host([border]) .item:hover::after {
  background-color: var(--item-border-color-hover);
}
:host([border]) .item:active::before,
:host([border]) .item:active::after {
  background-color: var(--item-border-color-active);
}

:host([checkable]) .item:hover {
  color: var(--bl-fg-hover, ${__fg_hover});
}

:host([checkable]) .item.checked,
:host([checkable]) .item.checked:hover {
  color: var(--bl-color-primary-base, ${__color_primary});
}

:host([disabled]) .item,
:host([disabled]) .item:focus,
:host([disabled]) .item:hover,
:host([disabled]) .item:active,
.item.item[disabled]:focus,
.item.item[disabled]:hover,
.item.item[disabled]:active,
.item.item[disabled] {
  background-color: var(--item-bg-disabled);
  color: var(--item-fg-disabled);
  cursor: default;
}
:host([disabled]) .item::before,
:host([disabled]) .item::after,
:host([disabled]) .item:focus::before,
:host([disabled]) .item:focus::after,
:host([disabled]) .item:hover::before,
:host([disabled]) .item:hover::after,
:host([disabled]) .item:active::before,
:host([disabled]) .item:active::after,
.item.item[disabled]:focus::before,
.item.item[disabled]:focus::after,
.item.item[disabled]:hover::before,
.item.item[disabled]:hover::after,
.item.item[disabled]:active::before,
.item.item[disabled]:active::after,
.item.item[disabled]::before,
.item.item[disabled]::after {
  background-color: var(--item-border-color-disabled);
}


 
.label {
  flex: 1 1 auto;
  padding: 4px;
}
.prefix:empty+.label {
  padding-left: 12px;
}
.prefix {
  flex: 0 0 auto;
}
.suffix {
  flex: 0 0 24px;
}
.item.checked .suffix:after {
  position: relative;
  display: block;
  content: '';
  width: 8px;
  height: 5px;
  margin: auto;
  border-width: 0;
  border-style: solid;
  border-color: var(--bl-color-primary-base, ${__color_primary});
  border-left-width: 1px;
  border-bottom-width: 1px;
  transform: rotate(-45deg);
}

.label .highlight {
  color: var(--bl-color-danger-base, ${__color_danger});
}
`;
