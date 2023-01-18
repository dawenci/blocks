import '../popup/index.js';
import '../list/index.js';
import { makeDomTemplate, makeStyleTemplate } from '../../common/template.js';
export const styleTemplate = makeStyleTemplate(`
bl-list {
  width: 200px;
  height: 240px;
  font-size: 14px;
}
`);
export const popupTemplate = makeDomTemplate(document.createElement('bl-popup'));
export const listTemplate = makeDomTemplate(document.createElement('bl-list'));
