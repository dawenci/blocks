import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div part="layout" id="layout">
  <div part="icon" id="icon"></div>
  <div part="main" id="main">
    <div part="content" id="content">
      <slot part="default-slot"></slot>
    </div>
  </div>
</div>
`);
