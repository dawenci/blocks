import { makeTemplate } from '../../common/template.js';
export const contentTemplate = makeTemplate(`
<div id="layout">
  <img id="img" style="opacity:0;" />
</div>
`);
export const placeholderTemplate = makeTemplate(`
<div id="placeholder">
  <div class="default">
    <bl-loading></bl-loading>
    <div class="placeholderText"></div>  
  </div>
  <div class="custom"><img></div>
</div>
`);
export const fallbackTemplate = makeTemplate(`
<div id="fallback">
  <div class="default">
    <bl-icon value="file-image"></bl-icon>
    <div class="fallbackText"></div>
  </div>
  <div class="custom"><img></div>
</div>
`);
