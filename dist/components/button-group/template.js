let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `
  <style>
  :host {
    display: inline-flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    font-size: 0;
  }
  </style>
  `;
    const TEMPLATE_HTML = `
  <slot></slot>
  `;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
