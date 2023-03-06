let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const template = document.createElement('template')
  template.innerHTML = /*html*/ `
  <a id="link"><slot></slot></a>
  <div id="separator"></div>
  `

  return (templateCache = template)
}
