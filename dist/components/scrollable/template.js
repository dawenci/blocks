import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div part="layout" id="layout">
  <div part="viewport" id="viewport">
    <slot part="default-slot"></slot>
  </div>
  <div part="horizontal-track" class="track" id="horizontal"><b part="horizontal-thumb" class="thumb"></b></div>
  <div part="vertical-track" class="track" id="vertical"><b part="vertical-thumb" class="thumb"></b></div>
  <b id="top"></b>
  <b id="right"></b>
  <b id="bottom"></b>
  <b id="left"></b>
</div>
`);
