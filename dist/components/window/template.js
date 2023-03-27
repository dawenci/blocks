import { makeTemplate } from '../../common/template.js';
export const windowTemplate = makeTemplate(`
<div part="layout" id="layout">
  <div id="header-bg"></div>
  <div id="body-bg"></div>

  <header id="header">
    <div id="icon"></div>
    <div id="name"></div>
  </header>

  <section id="body">
    <div id="content">
      <slot></slot>
    </div>
    <footer id="status-bar">
      <slot name="status-bar"></slot>
    </footer>
  </section>

  <b id="resize-top"></b>
  <b id="resize-left"></b>
  <b id="resize-right"></b>
  <b id="resize-bottom"></b>
  <b id="resize-top-left"></b>
  <b id="resize-top-right"></b>
  <b id="resize-bottom-right"></b>
  <b id="resize-bottom-left"></b>

  <div id="actions">
    <button id="minimize"></button>
    <button id="maximize"></button>
    <button id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
</div>
`);
