export const sizeObserve = (() => {
    if (window.ResizeObserver) {
        return function sizeObserve(el, handler) {
            const observer = new ResizeObserver(entries => {
                const len = entries.length;
                for (let i = 0; i < len; i += 1) {
                    const entry = entries[i];
                    if (entry.target === el) {
                        handler({
                            width: Math.ceil(entry.contentRect.width),
                            height: Math.ceil(entry.contentRect.height),
                        });
                    }
                }
            });
            observer.observe(el);
            return function () {
                observer.disconnect();
            };
        };
    }
    let passiveEvents = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveEvents = { passive: true };
            },
        });
        window.addEventListener('test', null, opts);
    }
    catch (e) {
    }
    return function sizeObserve(el, handler) {
        if (getComputedStyle(el).position === 'static')
            el.style.position = 'relative';
        const expand = document.createElement('div');
        expand.style.cssText =
            'position:absolute;top:1px;bottom:0;left:1px;right:0;z-index=-1;overflow:hidden;visibility:hidden;pointer-events:none;max-width:100%;max-height:100%;';
        const shrink = expand.cloneNode(false);
        shrink.style.cssText =
            'position:absolute;top:50%;bottom:0;left:50%;right:0;z-index=-1;overflow:hidden;visibility:hidden;pointer-events:none;max-width:100%;max-height:100%;';
        const expandChild = document.createElement('div');
        expandChild.style.cssText =
            'position:absolute;top:0;left:0;transition:0s;animation:none;';
        const shrinkChild = expandChild.cloneNode(false);
        shrinkChild.style.width = 'calc(200% + 1px)';
        shrinkChild.style.height = 'calc(200% + 1px)';
        expand.appendChild(expandChild);
        shrink.appendChild(shrinkChild);
        el.appendChild(expand);
        el.appendChild(shrink);
        let dirty = false;
        let rafId = 0;
        let lastWidth = 0;
        let lastHeight = 0;
        let initialHiddenCheck = true;
        let lastAnimationFrameForInvisibleCheck = 0;
        const size = {
            width: el.clientWidth,
            height: el.clientHeight,
        };
        function resetExpandShrink() {
            const width = expand.clientWidth;
            const height = expand.clientHeight;
            expandChild.style.width = width + 1 + 'px';
            expandChild.style.height = height + 1 + 'px';
            expand.scrollLeft = width || 1;
            expand.scrollTop = height || 1;
            shrink.scrollLeft = width + 1;
            shrink.scrollTop = height + 1;
        }
        function reset() {
            if (initialHiddenCheck) {
                const invisible = el.offsetWidth === 0 && el.offsetHeight === 0;
                if (invisible) {
                    if (!lastAnimationFrameForInvisibleCheck) {
                        lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function () {
                            lastAnimationFrameForInvisibleCheck = 0;
                            reset();
                        });
                    }
                    return;
                }
                else {
                    initialHiddenCheck = false;
                }
            }
            resetExpandShrink();
        }
        function onScroll() {
            if (!rafId) {
                rafId = requestAnimationFrame(onResized);
            }
            reset();
        }
        function onResized() {
            rafId = 0;
            size.width = el.clientWidth;
            size.height = el.clientHeight;
            dirty = size.width !== lastWidth || size.height !== lastHeight;
            if (!dirty)
                return;
            lastWidth = size.width;
            lastHeight = size.height;
            handler(size);
        }
        expand.addEventListener('scroll', onScroll, passiveEvents);
        shrink.addEventListener('scroll', onScroll, passiveEvents);
        lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function () {
            lastAnimationFrameForInvisibleCheck = 0;
            reset();
        });
        return function () {
            expand.removeEventListener('scroll', onScroll);
            shrink.removeEventListener('scroll', onScroll);
            el.removeChild(expand);
            el.removeChild(shrink);
        };
    };
})();
