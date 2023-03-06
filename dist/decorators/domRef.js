import { addDecoratorData } from './decorators.js';
export function domRef(selector, cache = true) {
    const decorator = (value, ctx) => {
        const cacheKey = cache ? Symbol() : '';
        let getter;
        let setter;
        if (cache) {
            getter = function () {
                if (this[cacheKey] == null) {
                    ;
                    this[cacheKey] = this.shadowRoot.querySelector(selector);
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
                return this.shadowRoot.querySelector(selector);
            };
            setter = function (value) {
            };
        }
        function init(initialValue) {
            return initialValue;
        }
        addDecoratorData({
            type: 'domRef',
            name: String(ctx.name),
        });
        return {
            init,
            get: getter,
            set: setter,
        };
    };
    return decorator;
}
