let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  :host {
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  
  :host([justify="start"]) {
    justify-content: flex-start;
  }
  :host([justify="end"]) {
    justify-content: flex-end;
  }
  :host([justify="center"]) {
    justify-content: center;
  }
  :host([justify="space-around"]) {
    justify-content: space-around;
  }
  :host([justify="space-between"]) {
    justify-content: space-between;
  }
  
  :host([align="top"]) {
    align-items: flex-start;
  }
  :host([align="middle"]) {
    align-items: center;
  }
  :host([align="bottom"]) {
    align-items: flex-end;
  }
  
  :host([wrap]) {
    flex-wrap: wrap;
  }
  </style>`;
    const TEMPLATE_HTML = `<slot></slot>`;
    const template = document.createElement('template');
    template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML;
    return (templateCache = template);
}
