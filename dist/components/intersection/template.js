let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const template = document.createElement('template');
    template.innerHTML = `<style>
  :host {
    box-sizing: border-box;
    display: block;
  }
  
  </style>
  <slot></slot>`;
    return (templateCache = template);
}
