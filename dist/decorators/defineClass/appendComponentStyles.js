export function appendComponentStyles(target, $fragment) {
    if ($fragment) {
        const $styleFragment = hasStyles(target)
            ? target._$componentStyle.cloneNode(true)
            : document.createDocumentFragment();
        $styleFragment.appendChild($fragment.cloneNode(true));
        Object.defineProperty(target, '_$componentStyle', {
            get: () => $styleFragment,
            enumerable: true,
            configurable: true,
        });
    }
}
function hasStyles(target) {
    return !!target._$componentStyle;
}
