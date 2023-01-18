const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;
function normalizeWheel(event) {
    let sX = 0;
    let sY = 0;
    let pX = 0;
    let pY = 0;
    if ('detail' in event) {
        sY = event.detail;
    }
    if ('wheelDelta' in event) {
        sY = -event.wheelDelta / 120;
    }
    if ('wheelDeltaY' in event) {
        sY = -event.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in event) {
        sX = -event.wheelDeltaX / 120;
    }
    if ('axis' in event &&
        event.axis === event.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ('deltaY' in event) {
        pY = event.deltaY;
    }
    if ('deltaX' in event) {
        pX = event.deltaX;
    }
    if ((pX || pY) && event.deltaMode) {
        if (event.deltaMode === 1) {
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
        }
        else {
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
        }
    }
    if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
    }
    return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY,
    };
}
export function onWheel(el, handler) {
    const isFirefox = typeof navigator !== 'undefined' &&
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const eventType = isFirefox ? 'DOMMouseScroll' : 'mousewheel';
    el.addEventListener(eventType, function (event) {
        const normalized = normalizeWheel(event);
        if (typeof handler === 'function') {
            handler.apply(this, [event, normalized]);
        }
    });
}
