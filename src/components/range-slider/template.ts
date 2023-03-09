import { makeTemplate } from '../../common/template.js'

export const template = makeTemplate(/*html*/ `
<div id="layout">
    <div id="track">
      <button class="point point1"></button>
      <button class="point point2"></button>
      <span class="line"></span>
      <div id="track__bg"></div>
    </div>
  </div>
`)
