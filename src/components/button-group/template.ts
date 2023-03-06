let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const TEMPLATE_HTML = /*html*/ `
  <slot></slot>
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE_HTML

  return (templateCache = template)
}
