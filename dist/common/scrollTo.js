const animateMap = new WeakMap();
export function scrollTo(scrollable, to = 0, options = {}) {
    if (!scrollable) {
        if (typeof options.done === 'function') {
            options?.done?.();
        }
        return noop;
    }
    if (animateMap.get(scrollable)) {
        animateMap.get(scrollable)?.();
    }
    const duration = options.duration || 0;
    const property = options.property ?? 'scrollTop';
    const startPosition = scrollable[property];
    const offset = to - startPosition;
    if (offset === 0) {
        if (typeof options.done === 'function') {
            options?.done?.();
        }
        animateMap.delete(scrollable);
        return noop;
    }
    if (duration <= 0) {
        ;
        scrollable[property] = to;
        if (typeof options.done === 'function') {
            options.done();
        }
        animateMap.delete(scrollable);
        return noop;
    }
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    let rafId;
    const cancel = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = undefined;
            if (typeof options.done === 'function') {
                options?.done?.();
            }
            animateMap.delete(scrollable);
        }
    };
    const refresh = () => {
        const now = Date.now();
        if (now >= endTime) {
            ;
            scrollable[property] = to;
            if (typeof options.done === 'function') {
                options.done();
            }
            animateMap.delete(scrollable);
            return;
        }
        const percentComplete = (options.smoother || easeInOutSmoother)((now - startTime) / (duration * 1000));
        const currentPosition = Math.trunc(percentComplete * offset + startPosition);
        scrollable[property] = currentPosition;
        rafId = requestAnimationFrame(refresh);
    };
    refresh();
    animateMap.set(scrollable, cancel);
    return cancel;
}
function easeInOutSmoother(t) {
    const ts = t * t;
    const tc = ts * t;
    return 6 * tc * ts - 15 * ts * ts + 10 * tc;
}
function noop() {
}
