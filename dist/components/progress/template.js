import { __color_danger, __color_primary, __color_success, __color_warning, __radius_base, __transition_duration, } from '../../theme/var-light.js';
import { useColorWithOpacity } from '../../common/color.js';
let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  @keyframes light {
    0% {
      transform: scale(0, 1);
      opacity: .3;
    }
    25% {
      transform: scale(0, 1);
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    75% {
      transform: scale(1, 1);
      opacity: 0;
    }
    100% {
      transform: scale(1, 1);
      opacity: 0;
    }
  }
  :host {
    display: block;
    box-sizing: border-box;
    position: relative;
    height: 5px;
  }
  #layout {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 1px;
  }
  #track {
    flex: 1 1 100%;
    box-sizing: border-box;
    height: 100%;
    border-radius: var(--bl-radius-base, ${__radius_base});
  }
  #progress {
    position: relative;
    width: 0;
    height: 100%;
    transition: var(--transition-duration, ${__transition_duration}) all;
    border-radius: var(--bl-radius-base, ${__radius_base});
  }
  #progress:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.2);
    animation: 2s linear infinite light;
    transform-origin: left top;
  }
  :host([value="100"]) #progress:after {
    animation: none;
  }
  
  #value {
    flex: 0 0 auto;
    box-sizing: border-box;
    height: 16px;
    margin-left: 5px;
    line-height: 16px;
    font-size: 12px;
    text-shadow: 1px 1px 0 rgba(255,255,255,.5);
  }
  
  #track { background-color: ${useColorWithOpacity(__color_primary, 0.1)} }
  #progress { background-color: var(--bl-color-primary-base, ${__color_primary}) }
  #value { color: var(--bl-color-primary-base, ${__color_primary}) }
  
  :host([status="success"]) #track { background-color: ${useColorWithOpacity(__color_success, 0.1)} }
  :host([status="success"]) #progress { background-color: var(--bl-color-success-base, ${__color_success}) }
  :host([status="success"]) #value { color: var(--bl-color-success-base, ${__color_success}) }
  
  :host([status="error"]) #track { background-color: ${useColorWithOpacity(__color_danger, 0.1)} }
  :host([status="error"]) #progress { background-color: var(--bl-color-danger-base, ${__color_danger}) }
  :host([status="error"]) #value { color: var(--bl-color-danger-base, ${__color_danger}) }
  
  :host([status="warning"]) #track { background-color: ${useColorWithOpacity(__color_warning, 0.1)} }
  :host([status="warning"]) #progress { background-color: var(--bl-color-warning-base, ${__color_warning}) }
  :host([status="warning"]) #value { color: var(--bl-color-warning-base, ${__color_warning}) }
  </style>`;
    const TEMPLATE_HTML = `
  <div id="layout">
    <div id="track">
      <div id="progress" part="progress"></div>
    </div>
    <div id="value" part="value"></div>
  </div>
  `;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
