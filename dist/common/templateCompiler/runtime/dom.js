export function fragment() {
    return document.createDocumentFragment();
}
export function element(name) {
    return document.createElement(name);
}
export function text(data) {
    return document.createTextNode(data);
}
export function comment(text) {
    return document.createComment(text ?? '');
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
export function prop(node, prop, value) {
    ;
    node[prop] = value;
}
export function append(target, node) {
    return target.appendChild(node);
}
export function insert(target, node, anchor = null) {
    return target.insertBefore(node, anchor);
}
export function before(anchor, node) {
    return insert(anchor.parentNode, node, anchor);
}
export function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
export function replace(node, anchor) {
    const result = insert(anchor.parentNode, node, anchor);
    detach(anchor);
    return result;
}
export function next(node) {
    return node.nextSibling;
}
export function prev(node) {
    return node.previousSibling;
}
export function event(node, eventType, handle, eventFlag = 0) {
    const map = node.__eventMap__ || (node.__eventMap__ = new Map());
    const key = eventType + '.' + eventFlag;
    const oldHandle = map.get(key);
    if (oldHandle) {
        if (oldHandle === handle || oldHandle.__raw === handle)
            return;
        node.removeEventListener(eventType, oldHandle);
        map.delete(key);
        if (handle === null)
            return;
    }
    if (handle === null)
        return;
    if (eventFlag) {
        function wrapper(e) {
            if (eventFlag & 0b00000010)
                e.preventDefault();
            if (eventFlag & 0b00000100)
                e.stopPropagation();
            if (eventFlag & 0b00001000)
                e.stopImmediatePropagation();
            handle.call(this, e);
            if (eventFlag & 0b00010000) {
                event(node, eventType, null, eventFlag);
            }
        }
        wrapper.__raw = handle;
        node.addEventListener(eventType, wrapper, {
            capture: !!(eventFlag & 0b00000001),
            passive: !!(eventFlag & 0b00100000),
        });
        map.set(key, wrapper);
    }
    else {
        node.addEventListener(eventType, handle);
        map.set(key, handle);
    }
}
export function parseHtml(html) {
    const $temp = document.createElement('div');
    $temp.innerHTML = html || '';
    return Array.prototype.slice.call($temp.childNodes);
}
