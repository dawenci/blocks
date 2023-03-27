export function captureEventWhenEnable(element, eventType, callback) {
    const handler = (e) => {
        if (element.disabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        callback(e);
    };
    element.addEventListener(eventType, handler, true);
    return () => {
        element.removeEventListener(eventType, handler, true);
    };
}
