import { boolGetter, boolSetter, strGetter, strSetter, intGetter, intSetter, enumGetter, enumSetter, numGetter, numSetter, intRangeGetter, intRangeSetter, } from '../../common/property.js';
export function makeAccessor(attrType = 'string', attrName, options) {
    let getImpl;
    if (options.get) {
        getImpl = options.get;
    }
    else {
        switch (attrType) {
            case 'string':
                getImpl = strGetter(attrName);
                break;
            case 'boolean':
                getImpl = boolGetter(attrName);
                break;
            case 'int':
                getImpl = intGetter(attrName);
                break;
            case 'enum':
                getImpl = enumGetter(attrName, options.enumValues ?? []);
                break;
            case 'number':
                getImpl = numGetter(attrName);
                break;
            case 'intRange':
                getImpl = intRangeGetter(attrName, options.min ?? 0, options.max ?? 0);
                break;
        }
    }
    let setImpl;
    if (options.set) {
        setImpl = options.set;
    }
    else {
        switch (attrType) {
            case 'string':
                setImpl = strSetter(attrName);
                break;
            case 'boolean':
                setImpl = boolSetter(attrName);
                break;
            case 'int':
                setImpl = intSetter(attrName);
                break;
            case 'enum':
                setImpl = enumSetter(attrName, options.enumValues ?? []);
                break;
            case 'number':
                setImpl = numSetter(attrName);
                break;
            case 'intRange':
                setImpl = intRangeSetter(attrName, options.min ?? 0, options.max ?? 0);
                break;
        }
    }
    function getter() {
        const value = getImpl.call(this, this);
        if (value != null)
            return value;
        if (options.defaults == null)
            return null;
        let defaults = options.defaults;
        if (typeof options.defaults === 'function') {
            defaults = options.defaults(this);
        }
        return (defaults ?? null);
    }
    function setter(value) {
        setImpl.call(this, this, value);
    }
    function init(initialValue) {
        if (options.defaults == null && initialValue != null) {
            options.defaults = initialValue;
        }
        return initialValue;
    }
    return {
        get: getter,
        set: setter,
        init,
    };
}
