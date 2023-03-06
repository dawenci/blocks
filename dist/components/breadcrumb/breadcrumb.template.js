let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const template = document.createElement('template');
    template.innerHTML = `<slot></slot>`;
    return (templateCache = template);
}
