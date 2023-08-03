export function makeAccessor(propName, options) {
    const getImpl = options.get ??
        ((element) => {
            return element[propName];
        });
    const setImpl = options.set ??
        ((element, value) => {
            ;
            element[propName] = value;
        });
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
