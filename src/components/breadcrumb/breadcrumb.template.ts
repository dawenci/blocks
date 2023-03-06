let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const template = document.createElement('template')
  template.innerHTML = /*html*/ `<slot></slot>`

  return (templateCache = template)
}
