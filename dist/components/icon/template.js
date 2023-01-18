let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  :host {
    display: inline-block;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    cursor: default;
    width: 32px;
    height: 32px;
  }
  :host(:focus) {
    outline: 0 none;
  }
  #layout {
    width: 100%;
    height: 100%;
  }
  #layout svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  </style>`;
    const TEMPLATE_HTML = `<div id="layout"></div>`;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
