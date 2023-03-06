import { __border_color_secondary, __font_size_base, __font_size_large, __font_size_small, __padding_base, __padding_large, __padding_small, __radius_base, } from '../../theme/var-light';
export const style = `
:host {
  --padding: var(--bl-padding-base, ${__padding_base});
  --border-color: var(--bl-border-color-secondary, ${__border_color_secondary});
  --radius: var(--bl-radius-base, ${__radius_base});
  --font-size: var(--bl-font-size-base, ${__font_size_base});
  --shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.05),
    0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}
:host {
  box-sizing: border-box;
  display: block;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: var(--font-size);
}
:host([size="small"]) {
  --padding: var(--bl-padding-small, ${__padding_small});
  --font-size: var(--bl-font-size-small, ${__font_size_small});
}
:host([size="large"]) {
  --padding: var(--bl-padding-large, ${__padding_large});
  --font-size: var(--bl-font-size-large, ${__font_size_large});
}

:host([shadow]:not([shadow="hover"])),
:host([shadow="hover"]:hover) {
  border-color: transparent;
  box-shadow: var(--shadow);
}

::slotted(img) { 
  max-width: 100%;
}

#header,
#footer,
#cover,
#body {
  overflow: hidden;
  padding: var(--padding);
}
#header.empty,
#footer.empty,
#cover.empty {
  display: none;
}

#cover {
  border-radius: var(--radius) var(--radius) 0 0;
  margin: -1px -1px 0 -1px;
  padding: 0;
}

#header {
  border-bottom: 1px solid var(--border-color);
}

#footer {
  border-top: 1px solid var(--border-color);
}
`;
