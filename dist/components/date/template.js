import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout" tabindex="-1">
  <header id="header">
    <button class="header-button button-prevPrev"></button>
    <button class="header-button button-prev"></button>
    <div class="header-content">
      <button class="header-title"></button>
    </div>
    <button class="header-button button-next"></button>
    <button class="header-button button-nextNext"></button>
  </header>

  <div id="body">
    <div class="week-header"></div>
    <div class="button-list"></div>
    <div class="body-loading">
      <bl-loading></bl-loading>
    </div>
  </div>
</div>
`);
