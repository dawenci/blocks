let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const TEMPLATE_CSS = /*html*/ `<style>
  :host, :host * {
    box-sizing: border-box;
  }
  </style>`

  const TEMPLATE_HTML = `
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

  return (templateCache = template)
}
