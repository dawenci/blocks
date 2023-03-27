import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div part="layout" id="layout">
  <div part="cover" id="cover"><slot part="cover-slot" name="cover"></slot></div>
  <header part="header" id="header"><slot part="header-slot" name="header"></slot></header>
  <div part="body" id="body"><slot part="body-slot"></slot></div>
  <div part="footer" id="footer"><slot part="footer-slot" name="footer"></slot></div>
</div>
`);
