import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <div id="icon">
    <slot name="icon"></slot>
  </div>
  <div id="content">
    <div id="title">
      <slot name="title"></slot>
    </div>
    <div id="description">
      <slot name="description"></slot>
    </div>
  </div>
</div>
`);
