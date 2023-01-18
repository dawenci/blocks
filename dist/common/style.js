import { camelCase } from './utils.js';
export function getStyle(el, prop) {
    return getComputedStyle(el)[camelCase(prop)];
}
export function setStyles(el, styles = {}) {
    Object.keys(styles).forEach(key => {
        el.style[camelCase(key)] = styles[key];
    });
}
