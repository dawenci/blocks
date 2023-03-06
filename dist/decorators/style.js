export function applyStyle(styleContent) {
    return (target, ctx) => {
        ctx.addInitializer(function () {
            const $style = document.createElement('style');
            $style.textContent = styleContent;
            const $styleFragment = hasStyles(target)
                ? target._$componentStyle.cloneNode(true)
                : document.createDocumentFragment();
            $styleFragment.appendChild($style);
            Object.defineProperty(target, '_$componentStyle', {
                get: () => $styleFragment,
                enumerable: true,
                configurable: true,
            });
        });
    };
}
function hasStyles(target) {
    return !!target._$componentStyle;
}
