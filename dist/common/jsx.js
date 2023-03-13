export const Fragment = 'jsx.Fragment';
export const createElement = (type, props, ...children) => {
    let $el;
    if (type === Fragment) {
        $el = document.createDocumentFragment();
    }
    else {
        $el = document.createElement(type);
        if (props) {
            Object.keys(props).forEach(prop => {
                ;
                $el[prop] = props[prop];
            });
        }
    }
    children.forEach($child => {
        if (typeof $child === 'string') {
            $el.appendChild(document.createTextNode($child));
        }
        else {
            $el.appendChild($child);
        }
    });
    return $el;
};
