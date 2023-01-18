let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const comTemplate = document.createElement('template');
    comTemplate.innerHTML = `
  <style>
  :host {
    display: inline-block;
  }
  </style>
  <slot id="slot"></slot>
  <span style="display:none;"><slot name="content"></slot></span>
  `;
    const popupTemplate = document.createElement('template');
    popupTemplate.innerHTML = `<bl-popup></bl-popup>`;
    return (templateCache = {
        comTemplate,
        popupTemplate,
    });
}
