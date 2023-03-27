import { makeFragmentTemplate } from '../../common/template.js';
export const template = makeFragmentTemplate(`
<a id="link"><slot></slot></a>
<div id="separator"></div>
`);
