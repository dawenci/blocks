export function makeElement(options) {
    if (typeof options === 'string') {
        return document.createTextNode(options);
    }
    const $el = document.createElement(options.tagName);
    if (options?.attrs) {
        Object.keys(options.attrs).forEach(attrName => {
            $el.setAttribute(attrName, options.attrs[attrName]);
        });
    }
    if (options?.props) {
        Object.keys(options.props).forEach(prop => {
            ;
            $el[prop] = options.props[prop];
        });
    }
    if (options?.styles) {
        Object.keys(options.styles).forEach(prop => {
            ;
            $el.style[prop] = options.styles[prop];
        });
    }
    ;
    (options.children ?? []).forEach(child => {
        const $child = makeElement(child);
        $el.appendChild($child);
    });
    return $el;
}
