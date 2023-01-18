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
  <slot></slot>
  `;
    const popupTemplate = document.createElement('template');
    popupTemplate.innerHTML = `
  <bl-popup>
    <div class="layout" style="padding:15px;">
      <div class="message" style="position:relative;box-sizing:border-box;margin-bottom:15px;font-size:12px;line-height:18px;"></div>
      <div class="actions" style="box-sizing:border-box;text-align:center;">
        <bl-button size="small" class="cancel" style="margin:0 5px;vertical-align:middle;">取消</bl-button>
        <bl-button size="small" class="confirm" type="primary" style="margin:0 5px;vertical-align:middle;">确定</bl-button>
      </div>
    </div>
  </bl-popup>
  `;
    return (templateCache = {
        comTemplate,
        popupTemplate,
    });
}
