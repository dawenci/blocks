import { makeTemplate } from '../../common/template.js';
export const radioTemplate = makeTemplate(`<span id="radio"></span>`);
export const labelTemplate = makeTemplate(`<label id="label"><slot></slot></label>`);
