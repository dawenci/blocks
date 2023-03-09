let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const PANE_TEMPLATE = `<style>
  :host {
    display: block;
    position: absolute;
    box-sizing: border-box;
  }
  :host(.horizontal) {
    height: 100%;
    width: auto;
  }
  :host(.vertical) {
    width: 100%;
    height: auto;
  }
  #content {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  </style>
  <div id="content" part="content"><slot></slot></div>
  `;
    const paneTemplate = document.createElement('template');
    paneTemplate.innerHTML = PANE_TEMPLATE;
    const $handleTemplate = document.createElement('div');
    $handleTemplate.className = 'handle';
    return (templateCache = {
        paneTemplate,
        $handleTemplate,
    });
}
