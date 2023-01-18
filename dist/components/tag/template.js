import { __font_family, __border_color_base, __height_base, __height_small, __height_large, __radius_base, __color_primary, __color_danger, __color_success, __color_warning, __transition_duration, __font_size_base, __font_size_small, } from '../../theme/var-light.js';
let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
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
    font-family: var(--font-family, ${__font_family});
    transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
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
  
  #close {
    flex: 0 0 auto;
    position: relative;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    margin: 0 0 0 2px;
    padding: 0;
    border: 1px solid transparent;
    background: transparent;
    transform: rotate(45deg);
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    transition: transform var(--transition-duration, ${__transition_duration});
  }
  #close:focus {
    outline: 0 none;
  }
  #close::before,
  #close::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    content: '';
    width: 2px;
    height: 2px;
    margin: auto;
  }
  #close::before {
    width: 8px;
  }
  #close::after {
    height: 8px;
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
  #close::before,
  #close::after { background: #ddd; }
  #close:hover { border-color: #ccc; }
  #close:hover::before,
  #close:hover::after { background: #ccc; }
  
  :host([type="primary"]) #close::before,
  :host([type="primary"]) #close::after,
  :host([type="danger"]) #close::before,
  :host([type="danger"]) #close::after,
  :host([type="warning"]) #close::before,
  :host([type="warning"]) #close::after,
  :host([type="success"]) #close::before,
  :host([type="success"]) #close::after { background-color: #fff; }
  :host([type="primary"]) #close:hover,
  :host([type="danger"]) #close:hover,
  :host([type="warning"]) #close:hover,
  :host([type="success"]) #close:hover { border-color: #fff; }
  
  :host([type="primary"][outline]) #close::before,
  :host([type="primary"][outline]) #close::after { background-color: var(--bl-color-primary-base, ${__color_primary}) }
  :host([type="primary"][outline]) #close:hover { border-color: var(--bl-color-primary-base, ${__color_primary}) }
  
  :host([type="danger"][outline]) #close::before,
  :host([type="danger"][outline]) #close::after { background-color: var(--bl-color-danger-base, ${__color_danger}) }
  :host([type="danger"][outline]) #close:hover { border-color: var(--bl-color-danger-base, ${__color_danger}) }
  
  :host([type="warning"][outline]) #close::before,
  :host([type="warning"][outline]) #close::after { background-color: var(--bl-color-warning-base, ${__color_warning}) }
  :host([type="warning"][outline]) #close:hover { border-color: var(--bl-color-warning-base, ${__color_warning}) }
  
  :host([type="success"][outline]) #close::before,
  :host([type="success"][outline]) #close::after { background-color: var(--bl-color-success-base, ${__color_success}) }
  :host([type="success"][outline]) #close:hover { border-color: var(--bl-color-success-base, ${__color_success}) }
  
  
  /* size */
  :host {
    --height: calc(var(--bl-height-base, ${__height_base}) - 12px);
    --padding: calc(var(--height) / 4);
    --font-size: var(--bl-font-size-small, ${__font_size_small});
  }
  :host([size="small"]) {
    --height: calc(var(--bl-height-small, ${__height_small}) - 12px);
    --padding: calc(var(--height) / 4);
    --font-size: var(--bl-font-size-small, ${__font_size_small});
  }
  :host([size="large"]) {
    --height: calc(var(--bl-height-large, ${__height_large}) - 12px);
    --padding: calc(var(--height) / 4);
    --font-size: var(--bl-font-size-base, ${__font_size_base});
  }
  </style>`;
    const TEMPLATE_HTML = `
  <div id="layout"><span id="label"><slot></slot></span></div>
  `;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
