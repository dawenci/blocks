const icons = new Map();
export function registerSvgIcon(key, data, attrs = {}) {
    icons.set(key, { data, attrs });
}
export function getRegisteredSvgIcon(key, attrs = {}) {
    if (!key)
        return null;
    const iconData = icons.get(key);
    if (!iconData)
        return null;
    return parseSvg(iconData.data, Object.assign({}, iconData.attrs, attrs));
}
export function parseSvg(str, attrs = {}) {
    const doc = new DOMParser().parseFromString(str, 'image/svg+xml');
    if (doc.querySelector('parsererror'))
        return null;
    let svg = doc.querySelector('svg');
    const children = doc.children;
    if (!svg && !children.length)
        return null;
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        Array.prototype.forEach.call(children, child => {
            svg.appendChild(child);
        });
    }
    Object.keys(attrs).forEach(attr => {
        svg.setAttribute(attr, attrs[attr]);
    });
    return svg;
}
export function parseIcon(icon, attrs = {}) {
    return getRegisteredSvgIcon(icon) ?? parseSvg(icon);
}
