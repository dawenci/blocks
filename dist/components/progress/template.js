import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div part="layout" id="layout">
  <div part="track" id="track">
    <div id="progress" part="progress"></div>
  </div>
  <div id="value" part="value"></div>
</div>
`);
