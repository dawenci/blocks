import { makeDomTemplate, makeFragmentTemplate } from '../../common/template.js';
export const contentTemplate = makeFragmentTemplate(`
<div id="head"></div>
<div id="body"><slot></slot></div>
`);
export const itemTemplate = makeDomTemplate(document.createElement('bl-nav-menu-item'));
