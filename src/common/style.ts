import { camelCase } from './utils.js'

export function getStyle(el: HTMLElement, prop: string) {
  return getComputedStyle(el)[camelCase(prop) as any]
}

export function setStyles(el: HTMLElement, styles: Record<string, string> = {}) {
  Object.keys(styles).forEach(key => {
    el.style[camelCase(key) as any] = styles[key]
  })
}
