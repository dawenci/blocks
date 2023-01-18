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
