import { makeDomTemplate, makeTemplate } from '../../common/template.js';
export const contentTemplate = makeTemplate(`
<div id="layout">
  <bl-icon id="icon"></bl-icon>
  <div id="label"></div>
  <bl-icon id="arrow" value="right"></bl-icon>
</div>
`);
export const menuTemplate = makeDomTemplate(document.createElement('bl-popup-menu'));
