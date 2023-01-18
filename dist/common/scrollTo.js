export function scrollTo(scrollable, to = 0, options = {}) {
    if (!scrollable)
        return;
    const duration = options.duration || 0;
    const property = options.property ?? 'scrollTop';
    const startPosition = scrollable[property];
    const offset = to - startPosition;
    if (offset === 0)
        return;
    if (duration <= 0) {
        ;
        scrollable[property] = to;
        if (typeof options.done === 'function') {
            options.done();
        }
        return;
    }
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    let rafId;
    const cancel = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = undefined;
            if (typeof options.done === 'function')
                options?.done?.();
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
            return;
        }
        const percentComplete = (options.smoother || easeInOutSmoother)((now - startTime) / (duration * 1000));
        const currentPosition = Math.trunc(percentComplete * offset + startPosition);
        scrollable[property] = currentPosition;
        rafId = requestAnimationFrame(refresh);
    };
    refresh();
    return cancel;
}
function easeInOutSmoother(t) {
    const ts = t * t;
    const tc = ts * t;
    return 6 * tc * ts - 15 * ts * ts + 10 * tc;
}
