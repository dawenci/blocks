export function attachShadow(target, ctx) {
    if (typeof target === 'function') {
        const options = { mode: 'open' };
        ctx.addInitializer(function () {
            Object.defineProperty(target, '_shadowRootInit', {
                get: () => options,
                enumerable: true,
                configurable: true,
            });
        });
    }
    else {
        const options = target;
        return function shadow(target, ctx) {
            ctx.addInitializer(function () {
                Object.defineProperty(target, '_shadowRootInit', {
                    get: () => options,
                    enumerable: true,
                    configurable: true,
                });
            });
        };
    }
}
