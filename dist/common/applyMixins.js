export function applyMixins(derivedCtor, constructors) {
    constructors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name === 'constructor' && derivedCtor.prototype.constructor) {
                return;
            }
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null));
        });
    });
    const rawObservedAttributes = derivedCtor.observedAttributes ?? [];
    function getObservedAttributes() {
        return constructors.reduce((acc, ctor) => acc.concat(ctor.observedAttributes ?? []), rawObservedAttributes);
    }
    Object.defineProperty(derivedCtor, 'observedAttributes', {
        get: () => getObservedAttributes(),
        enumerable: true,
        configurable: true,
    });
}
