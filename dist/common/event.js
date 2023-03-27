export function dispatchEvent(element, eventName, options = {}) {
    options = Object.assign({
        bubbles: true,
        cancelable: true,
        composed: true,
    }, options);
    const event = new CustomEvent(eventName, options);
    return element.dispatchEvent(event);
}
export function onEvent(element, type, listener, options) {
    element.addEventListener(type, listener, options);
    return () => {
        element.removeEventListener(type, listener, options);
    };
}
export function onceEvent(element, type, listener, options) {
    function wrapped(e) {
        element.removeEventListener(type, wrapped, options);
        listener.call(this, e);
    }
    element.addEventListener(type, wrapped, options);
    return () => {
        element.removeEventListener(type, wrapped, options);
    };
}
