import { makeTemplate } from '../../common/template.js'

// 内部使用 hsv 表示
// hue（色相分量）: 0 - 360 度的色环
// saturation（饱和度分量）：左右方向是 Saturation（饱和度） 取值 0 - 100。往左侧，白色越强，更稀释饱和度；往右侧，白色越少，越接近光谱颜色，饱和度越高。
// value（明度分量）：垂直方向是 Value（明度） 数值从 100 到 0 下降代表亮度下降的程度，为 0 时，最暗，为纯黑色。
// 增加黑色可以减小 value 而 saturation 不变，同样增加白色可以减小 saturation 而 value 不变。
// alpha（不透明度）： 0 - 1
export const template = makeTemplate(/*html*/ `
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
`)
