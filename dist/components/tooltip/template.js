import { makeFragmentTemplate } from '../../common/template.js';
export const template = makeFragmentTemplate(`
<slot id="slot"></slot>
<span style="display:none;"><slot name="content"></slot></span>
`);
