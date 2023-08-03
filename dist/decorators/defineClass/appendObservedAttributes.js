export function appendObservedAttributes(target, observedAttrs) {
    if (observedAttrs.length) {
        let newGetter;
        if (hasObservedAttributes(target)) {
            const mergedAttrs = [...new Set((target.observedAttributes ?? []).concat(observedAttrs))];
            newGetter = () => mergedAttrs;
        }
        else {
            newGetter = () => observedAttrs;
        }
        Object.defineProperty(target, 'observedAttributes', {
            get: () => newGetter(),
            enumerable: true,
            configurable: true,
        });
    }
}
function hasObservedAttributes(target) {
    return !!target.observedAttributes;
}
