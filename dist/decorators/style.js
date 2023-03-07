export function applyStyle(styleContent) {
    return (target, ctx) => {
        ctx.addInitializer(function () {
            const $style = document.createElement('style');
            $style.textContent = styleContent;
            appendComponentStyles(target, $style);
        });
    };
}
function hasStyles(target) {
    return !!target._$componentStyle;
}
export function appendComponentStyles(target, $fragment) {
    if ($fragment) {
        const $styleFragment = hasStyles(target)
            ? target._$componentStyle.cloneNode(true)
            : document.createDocumentFragment();
        $styleFragment.appendChild($fragment);
        Object.defineProperty(target, '_$componentStyle', {
            get: () => $styleFragment,
            enumerable: true,
            configurable: true,
        });
    }
}
