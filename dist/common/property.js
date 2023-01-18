export function strGetter(attr) {
    return element => element.getAttribute(attr);
}
export function strSetter(attr) {
    return (element, value) => {
        const oldAttrValue = element.getAttribute(attr);
        if (oldAttrValue === null && value === null)
            return;
        if (oldAttrValue === String(value))
            return;
        if (value === null) {
            element.removeAttribute(attr);
        }
        else {
            element.setAttribute(attr, value);
        }
    };
}
export function boolGetter(attr) {
    return element => element.hasAttribute(attr);
}
export function boolSetter(attr) {
    return (element, value) => {
        if (value === null || value === false) {
            if (element.hasAttribute(attr)) {
                element.removeAttribute(attr);
            }
        }
        else {
            if (!element.hasAttribute(attr)) {
                element.setAttribute(attr, '');
            }
        }
    };
}
export function numGetter(attr) {
    return (element) => {
        const rawValue = element.getAttribute(attr);
        if (rawValue == null)
            return null;
        const value = parseFloat(rawValue);
        if (Object.is(value, NaN)) {
            return null;
        }
        return value;
    };
}
export function numSetter(attr) {
    return (element, value) => {
        if (value === element.getAttribute(attr))
            return;
        if (value === null) {
            element.removeAttribute(attr);
            return;
        }
        if (typeof value === 'number') {
            element.setAttribute(attr, String(value));
        }
        else {
            if (Object.is(parseFloat(String(value)), NaN))
                return;
            element.setAttribute(attr, value);
        }
    };
}
export function intGetter(attr) {
    return element => {
        const rawValue = element.getAttribute(attr);
        if (rawValue == null)
            return null;
        const value = parseInt(rawValue, 10);
        if (Object.is(value, NaN)) {
            return null;
        }
        return value;
    };
}
export function intSetter(attr) {
    return (element, value) => {
        if (value === element.getAttribute(attr))
            return;
        if (value === null) {
            element.removeAttribute(attr);
            return;
        }
        if (typeof value === 'number') {
            element.setAttribute(attr, String(value));
        }
        else {
            if (Object.is(parseInt(String(value), 10), NaN))
                return;
            element.setAttribute(attr, value);
        }
    };
}
export function intRangeGetter(attr, min, max) {
    return element => {
        const value = intGetter(attr)(element);
        if (value === null || value < min || value > max)
            return null;
        return value;
    };
}
export function intRangeSetter(attr, min, max) {
    return (element, value) => {
        if (value === element.getAttribute(attr))
            return;
        if (value === null) {
            element.removeAttribute(attr);
            return;
        }
        if (typeof value === 'number') {
            if (value < min || value > max)
                return;
            element.setAttribute(attr, String(value));
        }
        else {
            value = parseInt(String(value), 10);
            if (Object.is(value, NaN) || value < min || value > max)
                return;
            element.setAttribute(attr, value);
        }
    };
}
export function enumGetter(attr, values) {
    return element => {
        const value = element.getAttribute(attr);
        if (value === null)
            return null;
        if (values.includes(value)) {
            return value;
        }
        return null;
    };
}
export function enumSetter(attr, values) {
    return (element, value) => {
        if (element.getAttribute(attr) === value) {
            return;
        }
        if (!values.includes(value)) {
            value = values[0];
        }
        if (value === null) {
            element.removeAttribute(attr);
        }
        else {
            element.setAttribute(attr, value);
        }
    };
}
