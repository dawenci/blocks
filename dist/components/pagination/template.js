let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const comTemplate = document.createElement('template');
    comTemplate.innerHTML = `
  <div id="layout">
    <div id="total"></div>
    <div id="sizes"></div>
    <div id="pager">
      <button id="prev"><bl-icon value="left"></button>
      <div id="items"></div>
      <button id="next"><bl-icon value="right"></button>
    </div>
    <div id="jump"></div>
  </div>`;
    const itemTemplate = document.createElement('button');
    const moreTemplate = document.createElement('bl-icon');
    moreTemplate.value = 'more';
    return (templateCache = {
        comTemplate,
        itemTemplate,
        moreTemplate,
    });
}
