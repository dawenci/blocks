export function applyStyle(styleContent) {
    return (target, ctx) => {
        ctx.addInitializer(function () {
            const $style = document.createElement('style');
            $style.textContent = styleContent;
            const styleChain = {
                $style,
                parent: hasStyles(target) ? target._styleChain : null,
            };
            Object.defineProperty(target, '_styleChain', {
                get: () => styleChain,
                enumerable: true,
                configurable: true,
            });
        });
    };
}
function hasStyles(target) {
    return !!target._styleChain;
}
