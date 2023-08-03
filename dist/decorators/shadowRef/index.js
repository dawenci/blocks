import { addDecoratorData } from '../decorators.js';
export const shadowRef = (selector, cache = true) => {
    const decorator = (_, ctx) => {
        let getter;
        let setter;
        if (cache) {
            const cacheKey = Symbol();
            getter = function () {
                if (this[cacheKey] == null) {
                    ;
                    this[cacheKey] = this.shadowRoot?.querySelector?.(selector) ?? null;
                }
                return this[cacheKey];
            };
            setter = function (value) {
                ;
                this[cacheKey] = value;
            };
        }
        else {
            getter = function () {
                return this.shadowRoot?.querySelector?.(selector) ?? null;
            };
            setter = function () {
            };
        }
        function init(initialValue) {
            return initialValue;
        }
        addDecoratorData({
            type: 'shadowRef',
            name: String(ctx.name),
        });
        return {
            init,
            get: getter,
            set: setter,
        };
    };
    return decorator;
};
