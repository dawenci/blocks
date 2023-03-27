import { makeFragmentTemplate } from '../../common/template.js';
export const contentTemplate = makeFragmentTemplate(`
<header part="header">
  <slot part="header-slot" name="header">
    <h1></h1>
  </slot>
</header>

<section part="body">
  <slot part="default-slot" id="body"></slot>
</section>

<footer part="footer">
  <slot part="footer-slot" name="footer"></slot>
</footer>
`);
