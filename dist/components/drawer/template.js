import { makeFragmentTemplate } from '../../common/template.js';
export const contentTemplate = makeFragmentTemplate(`
<div id="layout">
<header id="header">
  <div id="name">
    <slot name="name">
      <span id="name-prop"></span>
    </slot>
  </div>
  <button id="close">
    <bl-icon value="cross"></bl-icon>
  </button>
</header>
<div id="body"><slot></slot></div>
<footer id="footer"><slot name="footer"></slot></footer>
</div>
`);
