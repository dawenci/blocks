import * as BlNode from './node.js';
export const Fragment = 'jsx.Fragment';
export const createElement = (type, props, ...children) => {
    const childNodes = [];
    const pushChild = (children) => {
        children.forEach($child => {
            if (typeof $child === 'string') {
                childNodes.push(new BlNode.BlText($child));
            }
            else if ($child.nodeType === 1) {
                childNodes.push($child);
            }
            else if ($child.nodeType === 11) {
                childNodes.push(new BlNode.BlTemplate(new BlNode.BlFragment($child.childNodes)));
            }
        });
    };
    pushChild(children);
    let $el;
    if (type === Fragment) {
        $el = new BlNode.BlTemplate(new BlNode.BlFragment(childNodes));
    }
    else {
        type = type.toUpperCase();
        if (type === 'TEMPLATE') {
            $el = new BlNode.BlTemplate(new BlNode.BlFragment(childNodes));
        }
        else {
            $el = new BlNode.BlElement(type, new BlNode.BlAttributes(props ?? {}), childNodes);
        }
    }
    return $el;
};
