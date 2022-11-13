import { __font_size_base } from '../../theme/var-light.js'

let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const template = document.createElement('template')
  template.innerHTML = /*html*/ `<style>
  :host {
    box-sizing: border-box;
    font-size: var(--bl-font-size-base, ${__font_size_base});
  }
  </style>
  <slot></slot>`

  return (templateCache = template)
}
