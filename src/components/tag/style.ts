import {
  __font_family,
  __border_color_base,
  __height_base,
  __height_small,
  __height_large,
  __radius_base,
  __color_primary,
  __color_danger,
  __color_success,
  __color_warning,
  __transition_duration,
  __font_size_base,
  __font_size_small,
  __fg_base,
  __color_primary_shadow,
  __color_success_shadow,
  __color_warning_shadow,
  __color_danger_shadow,
} from '../../theme/var-light.js'

export const style = /*css*/ `
/*<component>tag*/
:host {
  display: inline-block;
  box-sizing: border-box;
  height: var(--height);
  padding: 0 var(--padding);
  border-radius: var(--bl-radius-base, ${__radius_base});
  border-width: 1px;
  border-style: solid;
  cursor: default;
  text-align: center;
  font-family: var(--bl-font-family, ${__font_family});
  transition: color var(--bl-transition-duration, ${__transition_duration}), border-color var(--bl-transition-duration, ${__transition_duration});
  user-select: none;
}
:host([round]) {
  border-radius: calc(var(--height) / 2);
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#label   {
  flex: 1 1 100%;
  display: block;
  box-sizing: border-box;
  font-size: var(--font-size);
  white-space: nowrap;
}

[part="close"] {
  --size: 14px;
  --shadow-size: 2px;
  flex: 0 0 auto;
  margin: 0 -2px 0 2px;
  opacity: .8;
}
[part="close"]:hover {
  opacity: .9;
}
[part="close"]:active {
  opacity: 1;
}

/* background */
:host { background-color: #fff; }
:host([type="primary"]) { background-color: var(--bl-color-primary-base, ${__color_primary}); }
:host([type="danger"]) { background-color: var(--bl-color-danger-base, ${__color_danger}); }
:host([type="success"]) { background-color: var(--bl-color-success-base, ${__color_success}); }
:host([type="warning"]) { background-color: var(--bl-color-warning-base, ${__color_warning}); }
:host([outline]) { background-color: transparent; }


/* border-color */
:host { border-color: var(--bl-border-color-base, ${__border_color_base}); }
:host([type="primary"]) { border-color: var(--bl-color-primary-base, ${__color_primary}); }
:host([type="danger"]) { border-color: var(--bl-color-danger-base, ${__color_danger}); }
:host([type="warning"]) { border-color: var(--bl-color-warning-base, ${__color_warning}); }
:host([type="success"]) { border-color: var(--bl-color-success-base, ${__color_success}); }


/* color */
:host([type="primary"]),
:host([type="danger"]),
:host([type="warning"]),
:host([type="success"]) { color: #fff; }
:host([type="primary"][outline]) { color: var(--bl-color-primary-base, ${__color_primary}) }
:host([type="danger"][outline]) { color: var(--bl-color-danger-base, ${__color_danger}) }
:host([type="warning"][outline]) { color: var(--bl-color-warning-base, ${__color_warning}) }
:host([type="success"][outline])  { color: var(--bl-color-success-base, ${__color_success}) }


/* close color */
[part="close"],
[part="close"]:hover {
  --fg: var(--bl-fg-base, ${__fg_base});
  --fg-hover: var(--bl-fg-base, ${__fg_base});
  --fg-active: var(--bl-fg-base, ${__fg_base});
}

:host([type="primary"]) [part="close"],
:host([type="primary"]) [part="close"]:hover,
:host([type="danger"]) [part="close"],
:host([type="danger"]) [part="close"]:hover,
:host([type="warning"]) [part="close"],
:host([type="warning"]) [part="close"]:hover,
:host([type="success"]) [part="close"],
:host([type="success"]) [part="close"]:hover {
  --fg: #fff;
  --fg-hover: #fff;
  --fg-active: #fff;
  --bg-hover: rgba(255,255,255,.25);
  --bg-active: rgba(255,255,255,.35);
}

:host([type="primary"][outline]) [part="close"],
:host([type="primary"][outline]) [part="close"]:hover {
  --fg: var(--bl-color-primary-base, ${__color_primary});
  --fg-hover: var(--bl-color-primary-base, ${__color_primary});
  --fg-active: var(--bl-color-primary-base, ${__color_primary});
  --focus-shadow: var(--bl-color-primary-shadow, ${__color_primary_shadow});
}
:host([type="danger"][outline]) [part="close"],
:host([type="danger"][outline]) [part="close"]:hover {
  --fg: var(--bl-color-danger-base, ${__color_danger});
  --fg-hover: var(--bl-color-danger-base, ${__color_danger});
  --fg-active: var(--bl-color-danger-base, ${__color_danger});
  --focus-shadow: var(--bl-color-danger-shadow, ${__color_danger_shadow});
}
:host([type="warning"][outline]) [part="close"],
:host([type="warning"][outline]) [part="close"]:hover {
  --fg: var(--bl-color-warning-base, ${__color_warning});
  --fg-hover: var(--bl-color-warning-base, ${__color_warning});
  --fg-active: var(--bl-color-warning-base, ${__color_warning});
  --focus-shadow: var(--bl-color-warning-shadow, ${__color_warning_shadow});
}
:host([type="success"][outline]) [part="close"],
:host([type="success"][outline]) [part="close"]:hover {
  --fg: var(--bl-color-success-base, ${__color_success});
  --fg-hover: var(--bl-color-success-base, ${__color_success});
  --fg-active: var(--bl-color-success-base, ${__color_success});
  --focus-shadow: var(--bl-color-success-shadow, ${__color_success_shadow});
}


/* size */
:host {
  --height: calc(var(--bl-height-base, ${__height_base}) - 12px);
  --padding: calc(var(--height) / 4);
  --font-size: var(--bl-font-size-small, ${__font_size_small});
}
[part="close"] {
  --size: 15px;
  --padding: 3px;
  --shadow-size: 1px;
  --border-width: 0px;
}
:host([size="small"]) {
  --height: calc(var(--bl-height-small, ${__height_small}) - 12px);
  --padding: calc(var(--height) / 4);
  --font-size: var(--bl-font-size-small, ${__font_size_small});
}
:host([size="small"]) [part="close"] {
  --size: 13px;
  --shadow-size: 1px;
}
:host([size="large"]) {
  --height: calc(var(--bl-height-large, ${__height_large}) - 12px);
  --padding: calc(var(--height) / 4);
  --font-size: var(--bl-font-size-base, ${__font_size_base});
}
:host([size="large"]) [part="close"] {
  --size: 19px;
  --shadow-size: 2px;
}
`
