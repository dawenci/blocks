export function onClickOutside(el, handler) {
    if (!Array.isArray(el)) {
        el = [el];
    }
    const callback = (e) => {
        if (!el.some(el => el.contains(e.target))) {
            handler(e);
        }
    };
    document.addEventListener('mousedown', callback);
    return () => {
        document.removeEventListener('mousedown', callback);
    };
}
