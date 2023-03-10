import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<div id="layout">
  <input id="choose-file" type="file">
  <div id="dropZone">
    点击或拖拽文件到此处
  </div>
  <bl-button id="choose">选择文件</bl-button>
  <div id="list"></div>
</div>
`);
