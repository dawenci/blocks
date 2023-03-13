import { makeFragmentTemplate } from '../../common/template.js';
export const template = makeFragmentTemplate(`
<header class="header"></header>
  <div class="list">
    <slot></slot>
  </div>
`);
