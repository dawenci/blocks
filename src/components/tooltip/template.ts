let templateCache: {
  comTemplate: HTMLTemplateElement
  popupTemplate: HTMLTemplateElement
}

export function template() {
  if (templateCache) return templateCache

  const comTemplate = document.createElement('template')
  comTemplate.innerHTML = /*html*/ `
  <style>
  :host {
    display: inline-block;
  }
  </style>
  <slot id="slot"></slot>
  <span style="display:none;"><slot name="content"></slot></span>
  `

  const popupTemplate = document.createElement('template')
  popupTemplate.innerHTML = /*html*/ `<bl-popup></bl-popup>`

  return (templateCache = {
    comTemplate,
    popupTemplate,
  })
}
