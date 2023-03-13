import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <div id="panes"><slot></slot></div>
  <div id="cover"></div>
</div>
`);
