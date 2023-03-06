import { makeFragmentTemplate } from '../../common/template.js'

export const dialogTemplate = makeFragmentTemplate(/*html*/ `
<header>
<slot name="header">
  <h1></h1>
</slot>
</header>

<section>
<slot></slot>
</section>

<footer>
<slot name="footer"></slot>
</footer>

<button id="close"></button>
`)
