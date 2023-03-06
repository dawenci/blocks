import { boolGetter, boolSetter, strGetter, strSetter, intGetter, intSetter, enumGetter, enumSetter, numGetter, numSetter, intRangeGetter, intRangeSetter, } from '../common/property.js';
import { kebabCase } from '../common/utils.js';
import { addDecoratorData } from './decorators.js';
export function attr(attrType = 'string', options = { defaults: null }) {
    const decorator = (accessor, ctx) => {
        const attrName = kebabCase(String(ctx.name));
        let getValue;
        switch (attrType) {
            case 'string':
                getValue = strGetter(attrName);
                break;
            case 'boolean':
                getValue = boolGetter(attrName);
                break;
            case 'int':
                getValue = intGetter(attrName);
                break;
            case 'enum':
                getValue = enumGetter(attrName, options.enumValues);
                break;
            case 'number':
                getValue = numGetter(attrName);
                break;
            case 'intRange':
                getValue = intRangeGetter(attrName, options.min, options.max);
                break;
        }
        let setValue;
        switch (attrType) {
            case 'string':
                setValue = strSetter(attrName);
                break;
            case 'boolean':
                setValue = boolSetter(attrName);
                break;
            case 'int':
                setValue = intSetter(attrName);
                break;
            case 'enum':
                setValue = enumSetter(attrName, options.enumValues);
                break;
            case 'number':
                setValue = numSetter(attrName);
                break;
            case 'intRange':
                setValue = intRangeSetter(attrName, options.min, options.max);
                break;
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
            type: 'attr',
            name: String(ctx.name),
            attrType,
            attrName,
            upgrade: true,
            observed: options.observed,
        });
        return {
            get: getter,
            set: setter,
            init,
        };
    };
    return decorator;
}
export const attrs = {
    size: attr('enum', { enumValues: ['small', 'large'] }),
};
