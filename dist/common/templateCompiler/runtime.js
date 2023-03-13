export function element(name) {
    return document.createElement(name);
}
export function text(data) {
    return document.createTextNode(data);
}
export function space() {
    return text(' ');
}
export function empty() {
    return text('');
}
export function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
export function append(target, node) {
    target.appendChild(node);
}
export function insert(target, node, anchor = null) {
    target.insertBefore(node, anchor);
}
