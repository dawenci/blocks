export const mixins = (constructors) => {
    const decorator = (target, { addInitializer }) => {
        addInitializer(function () {
            constructors.forEach(baseCtor => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    if (name === 'constructor' && target.prototype.constructor) {
                        return;
                    }
                    Object.defineProperty(target.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                        Object.create(null));
                });
            });
            const rawObservedAttributes = target.observedAttributes ?? [];
            function getObservedAttributes() {
                return constructors.reduce((acc, ctor) => acc.concat(ctor.observedAttributes ?? []), rawObservedAttributes);
            }
            Object.defineProperty(target, 'observedAttributes', {
                get: () => getObservedAttributes(),
                enumerable: true,
                configurable: true,
            });
        });
    };
    return decorator;
};
