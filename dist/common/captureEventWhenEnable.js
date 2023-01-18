export function captureEventWhenEnable(element, eventType, callback) {
    element.addEventListener(eventType, (e) => {
        if (element.disabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        callback(e);
    }, true);
}
