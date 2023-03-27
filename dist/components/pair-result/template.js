import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="content">
  <input part="first" id="first" readonly />
  <div part="separator" id="separator">至</div>
  <input part="second" id="second" readonly />
</div>
`);
