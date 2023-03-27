import { addDecoratorData } from './decorators.js';
export function prop(options = { defaults: null }) {
    const decorator = (accessor, ctx) => {
        const attrName = String(ctx.name);
        let getValue;
        let setValue;
        if (options.get && options.set) {
            getValue = options.get;
            setValue = options.set;
        }
        else {
            getValue = (element) => {
                return element[attrName];
            };
            setValue = (element, value) => {
                element[attrName] = value;
            };
        }
        function getter() {
            const value = getValue(this);
            if (value != null)
                return value;
            if (options.defaults != null) {
                let defaults = options.defaults;
                if (typeof options.defaults === 'function') {
                    defaults = options.defaults(this);
                }
                return (defaults ?? null);
            }
            else {
                return null;
            }
        }
        function setter(value) {
            setValue(this, value);
        }
        function init(initialValue) {
            if (options.defaults == null && initialValue != null) {
                options.defaults = initialValue;
            }
            return initialValue;
        }
        addDecoratorData({
            type: 'prop',
            name: String(ctx.name),
            attrName,
            upgrade: options.upgrade ?? true,
            observed: false,
        });
        return {
            get: getter,
            set: setter,
            init,
        };
    };
    return decorator;
}
