import { makeFragmentTemplate } from '../../common/template.js';
export const template = makeFragmentTemplate(`
<div id="layout">
  <bl-icon id="icon"></bl-icon>
  <div id="label"></div>
  <bl-icon id="arrow" value="right"></bl-icon>
</div>
<slot></slot>
`);
