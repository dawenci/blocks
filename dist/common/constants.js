import { kebabCase } from './utils.js';
export const PROXY_POPUP_ACCESSORS = ['arrow', 'offsetX', 'offsetY', 'open', 'origin'];
export const PROXY_POPUP_ACCESSORS_KEBAB = PROXY_POPUP_ACCESSORS.map(kebabCase);
export const PROXY_RESULT_ACCESSORS = [
    'clearable',
    'maxTagCount',
    'multiple',
    'placeholder',
    'searchable',
    'size',
];
export const PROXY_RESULT_ACCESSORS_KEBAB = PROXY_RESULT_ACCESSORS.map(kebabCase);
