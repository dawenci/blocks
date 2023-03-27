import '../popup/index.js';
import '../list/index.js';
import { makeTemplate } from '../../common/template.js';
export const resultTemplate = makeTemplate(`<bl-select-result></bl-select-result>`);
export const slotTemplate = makeTemplate(`<slot part="slot" style="display:none;"></slot>`);
export const popupTemplate = makeTemplate(`
<bl-popup append-to-body origin="top-start" arrow>
  <bl-list class="option-list" checkable id-field="value" label-field="label"></bl-list>
</bl-popup>
`);
