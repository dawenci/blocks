import { makeTemplate } from '../../common/template.js';
export const resultTemplate = makeTemplate(`<bl-select-result part="result" suffix-icon="down"></bl-select-result>`);
export const slotTemplate = makeTemplate(`<slot part="slot" style="display:none;"></slot>`);
export const popupTemplate = makeTemplate(`
<bl-popup append-to-body origin="top-start" arrow>
  <bl-list class="option-list" checkable id-field="value" label-field="label"></bl-list>
</bl-popup>
`);
export const confirmTemplate = makeTemplate(`
<bl-button type="primary" size="small" block style="margin:8px">确定</bl-button>
`);
