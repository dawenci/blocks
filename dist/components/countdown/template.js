let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  :host {
    box-sizing: border-box;
  }
  #layout {
    display: inline;
  }
  </style>`;
    const TEMPLATE_HTML = `
  <div id="layout"></div>
  `;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
