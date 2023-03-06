import { makeTemplate } from '../../common/template.js';
export const checkboxTemplate = makeTemplate(`
<span id="checkbox"></span>`);
export const labelTemplate = makeTemplate(`
<label id="label"><slot></slot></label>`);
