import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <div id="content">
    <div id="mask"></div>
    <img id="active" />
  </div>
  <div id="thumbnails"></div>
  <div id="toolbar">
    <button class="button" id="rotate-left"><bl-icon value="rotate-left"></bl-icon></button>
    <button class="button" id="rotate-right"><bl-icon value="rotate-right"></bl-icon></button>
    <button class="button" id="zoom-out"><bl-icon value="zoom-out"></bl-icon></button>
    <button class="button" id="zoom-in"><bl-icon value="zoom-in"></bl-icon></button>
    <button class="button" id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
  <button class="button" id="prev"><bl-icon value="left"></bl-icon></button>
  <button class="button" id="next"><bl-icon value="right"></bl-icon></button>
  <slot></slot>
</div>
`);
