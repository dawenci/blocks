import { __radius_base, __border_color_base, __fg_secondary, } from '../../theme/var-light.js';
let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  :host {
    display: block;
    box-sizing: border-box;
    user-select: none;
    cursor: default;
    background-color: #fff;
    width: 100%;
    height: 234px;
    min-width: 180px;
    min-height: 180px;
  }
  :host(:focus) {
    outline: 0 none;
  }
  #layout {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
  }
  #hsv-picker {
    flex: 1 1 100%;
    position: relative;
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }
  
  #hsv-picker,
  #hsv-picker button {
    cursor: crosshair;
  }
  
  #hsv-picker .hue,
  #hsv-picker .saturation,
  #hsv-picker .value {
    position: absolute;
    top: 6px;
    right: 6px;
    bottom: 6px;
    left: 6px;
  }
  #hsv-picker .hue {
    background: hsl(0, 100%, 50%);
  }
  #hsv-picker .saturation {
    background: linear-gradient(to right, #fff, transparent);
  }
  #hsv-picker .value {
    background: linear-gradient(to top, #000, transparent);
  }
  
  #controls {
    flex: 0 0 auto;
    display: flex;
    flex-flow: row nowrap;
  }
  
  #result:before,
  #alpha-bar:before {
    content: '';
    display: block;
    position: absolute;
    z-index: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) repeat;
  }
  #result {
    position: relative;
    flex: 0 0 50px;
    padding: 6px;
  }
  #result .bg {
    box-sizing: border-box;
    position: relative;
    height: 100%;
    border: 1px solid var(--bl-border-color-base, ${__border_color_base});
    background: hsl(0, 100%, 50%);
  }
  #result:before {
    top: 6px;
    right: 6px;
    bottom: 6px;
    left: 6px;
  }
  #bars {
    flex: 1 1 auto;
  }
  #bars > div {
    margin: 6px 0;
  }
  #hue-bar,
  #alpha-bar {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 12px;
  }
  #alpha-bar:before {
    top: 0;
    right: 6px;
    bottom: 0;
    left: 6px;
    border-radius: 6px;
  }
  #hue-bar .bg,
  #alpha-bar .bg {
    position: absolute;
    top: 0;
    right: 6px;
    bottom: 0;
    left: 6px;
    border-radius: 6px;
  }
  
  #hue-bar .bg {
    /* 色环每 60 度一个主色，分别为 红、黄、绿、青、蓝、洋红 */
    background: linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%));
  }
  #alpha-bar .bg {
    background: linear-gradient(to right, transparent, hsl(0,100%,50%));
  }
  
  #hsv-picker button,
  #hue-bar button,
  #alpha-bar button {
    position: absolute;
    width: 12px;
    height: 12px;
    margin: 0;
    padding: 0;
    border: 0;
    background: #fff;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,.2);
  }
  #hsv-picker button:focus,
  #hue-bar button:focus,
  #alpha-bar button:focus {
    z-index: 2;
    border: 1px solid rgba(0,0,0,.2);
    outline: 0 none;
    box-shadow: 0 0 2px 2px rgba(0,0,0,.1);
  }
  
  #hue-bar button,
  #alpha-bar button {
    left: 0;
    top: 0;
  }
  
  #models {
    flex: 0 0 auto;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    padding: 6px 32px 6px 6px;
    text-align: center;
  }
  #mode-content {
    width: 100%;
    display: flex;
    flex-flow: row;
    overflow: hidden;
  }
  #mode-content > div {
    box-sizing: border-box;
    width: 100%;
  }
  #mode-content > div:not(:first-child) {
    margin-left: 5px;
  }
  #mode-content input {
    box-sizing: border-box;
    width: 100%;
    height: 24px;
    line-height: 24px;
    vertical-align: top;
    text-align: center;
    border: 1px solid var(--bl-border-color-base, ${__border_color_base});
    border-radius: var(--bl-radius-base, ${__radius_base});
    font-size: 12px;
  }
  #mode-content input:focus {
    outline: none;
  }
  #mode-content span {
    display: block;
    font-size: 10px;
    color: var(--bl-fg-secondary, ${__fg_secondary});
  }
  #mode-switch {
    position: absolute;
    top: 6px;
    right: 6px;
    bottom: 6px;
    left: auto;
    width: 20px;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 1px solid var(--bl-border-color-base, ${__border_color_base});
    background: none;
    line-height: 24px;
    text-align: center;
    border-radius: var(--bl-radius-base, ${__radius_base});
  }
  #mode-switch:focus {
    outline: none;
  }
  #mode-switch:hover {
    background: rgba(0,0,0,.05);
  }
  #mode-switch::before,
  #mode-switch::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    width: 0;
    height: 0;
    margin: auto;
    border: 4px solid transparent;
  }
  #mode-switch::before {
    top: 0px;
    border-bottom-color: var(--bl-border-color-base, ${__border_color_base});
  }
  #mode-switch::after {
    bottom: 0;
    border-top-color: var(--bl-border-color-base, ${__border_color_base});
  }
  
  </style>`;
    const TEMPLATE_HTML = `
  <div id="layout">
    <!-- 颜色选择区域 -->
    <div id="hsv-picker">
      <div class="hue"></div>
      <div class="saturation"></div>
      <div class="value"></div>
      <button></button>
    </div>
  
    <!-- 控制条 -->
    <div id="controls">
      <div id="result">
        <div class="bg"></div>
      </div>
      <div id="bars">
        <div id="hue-bar">
          <div class="bg"></div>
          <button></button>
        </div>
        <div id="alpha-bar">
          <div class="bg"></div>
          <button></button>
        </div>    
      </div>
    </div>
  
    <!-- 输入输出区 -->
    <div id="models">
      <div id="mode-content">
        <div><input data-index="0" /><span></span></div>
        <div><input data-index="1" /><span></span></div>
        <div><input data-index="2" /><span></span></div>
        <div><input data-index="3" /><span></span></div>
      </div>
      <button id="mode-switch"></button>
    </div>
  </div>
  `;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
