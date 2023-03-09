import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <div id="viewport">
    <slot></slot>
  </div>
  <div class="track" id="horizontal"><b class="thumb"></b></div>
  <div class="track" id="vertical"><b class="thumb"></b></div>
  <b id="top"></b>
  <b id="right"></b>
  <b id="bottom"></b>
  <b id="left"></b>
</div>
`);
