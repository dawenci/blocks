import { attr } from './decorator.js';
export { attr };
export { makeAccessor as makeAttrAccessor } from './makeAccessor.js';
export const attrs = {
    size: attr('enum', { enumValues: ['small', 'large'] }),
};
