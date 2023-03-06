import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
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
`);
