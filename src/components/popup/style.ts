import {
  __bg_base,
  __border_color_base,
  __fg_base,
  __radius_base,
  __z_index_popup_base,
  __z_index_popup_focus,
} from '../../theme/var-light.js'

export const style = /*css*/ `
/* <component>popup */
:host {
  --radius: var(--bl-radius-base, ${__radius_base});
  --bg: var(--bl-bg-base, ${__bg_base});
  --fg: var(--bl-fg-base, ${__fg_base});
  --z-index: var(--bl-z-index-popup-base, ${__z_index_popup_base});
  --z-index-focus: var(--bl-z-index-popup-focus, ${__z_index_popup_focus});
  --border-width: 0;
  --border-color: var(--bl-border-color-base, ${__border_color_base});
}

:host {
  /* https://developers.google.com/web/updates/2016/06/css-containment */
  contain: none;
  box-sizing: border-box;
  position: absolute;
  color: var(--fg);
  z-index: var(--z-index);
}
:host(:focus), :host(:focus-within), :host(:focus-visible) {
  z-index: var(--z-index-focus);
  outline: 0 none;
}

[part="layout"] {
  contain: paint;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}


[part="bg"] {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  fill: var(--bg);
  stroke: var(--border-color);
  filter: drop-shadow(0 0 3px rgb(0,0,0,0.1));
}
:host(:focus) [part="bg"],
:host(:focus-visible) [part="bg"],
:host(:focus-within) [part="bg"] {
  filter: drop-shadow(0 0 3px rgb(0,0,0,0.15));
}


[part="shadow"] {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: var(--radius);
  background-color: var(--bg);
}


/* 默认无方向阴影 */
:host [part="shadow"] {
  box-shadow: 0 0 16px 0 rgb(0,0,0,0.08), 0 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus) [part="shadow"],
:host(:focus-visible) [part="shadow"],
:host(:focus-within) [part="shadow"] {
  outline: 0 none;
  box-shadow: 0 0 16px 0 rgb(0,0,0,0.08), 0 0 28px 8px rgb(0,0,0,0.05);
}

/* 箭头指向上方，阴影向下 */
:host([origin^="top-"]) [part="shadow"], :host([origin^="bottom-"][vertical-flipped]) [part="shadow"] {
  box-shadow: 0 6px 16px 0 rgb(0,0,0,0.08), 0 9px 28px 8px rgb(0,0,0,0.05);
}
:host([origin^="top-"]:focus) [part="shadow"], :host([origin^="bottom-"][vertical-flipped]:focus) [part="shadow"] {
  box-shadow: 0 6px 16px 0 rgb(0,0,0,0.08), 0 9px 28px 8px rgb(0,0,0,0.05);
}

/* 箭头指向下方，阴影向上 */
:host([origin^="bottom-"]) [part="shadow"], :host([origin^="top-"][vertical-flipped]) [part="shadow"] {
  box-shadow: 0 -6px 16px 0 rgb(0,0,0,0.08), 0 -9px 28px 8px rgb(0,0,0,0.05);
}
:host([origin^="bottom-"]:focus-within) [part="shadow"], :host([origin^="top-"][vertical-flipped]:focus-within) [part="shadow"] {
  box-shadow: 0 -6px 16px 0 rgb(0,0,0,0.08), 0 -9px 28px 8px rgb(0,0,0,0.05);
}

/* 箭头指向左方，阴影向右 */
:host([origin^="left-"]) [part="shadow"], :host([origin^="right-"][horizontal-flipped]) [part="shadow"] {
  box-shadow: 6px 0 16px 0 rgb(0,0,0,0.08), 9px 0 28px 8px rgb(0,0,0,0.05);
}
:host([origin^="left-"]:focus-within) [part="shadow"], :host([origin^="right-"][horizontal-flipped]:focus-within) [part="shadow"] {
  box-shadow: 6px 0 16px 0 rgb(0,0,0,0.08), 9px 0 28px 8px rgb(0,0,0,0.05);
}

/* 箭头指向右方，阴影向左 */
:host([origin^="right-"]) [part="shadow"], :host([origin^="left-"][horizontal-flipped]) [part="shadow"] {
  box-shadow: -6px 0 16px 0 rgb(0,0,0,0.08), -9px 0 28px 8px rgb(0,0,0,0.05);
}
:host([origin^="right-"]:focus-within) [part="shadow"], :host([origin^="left-"][horizontal-flipped]:focus-within) [part="shadow"] {
  box-shadow: -6px 0 16px 0 rgb(0,0,0,0.08), -9px 0 28px 8px rgb(0,0,0,0.05);
}

[part="first-focusable"], [part="last-focusable"], [part="first-focusable"]:focus, [part="last-focusable"]:focus {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}
`
