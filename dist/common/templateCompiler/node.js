var NodeType;
(function (NodeType) {
    NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeType[NodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(NodeType || (NodeType = {}));
export class BlAttributes {
    length;
    constructor(props) {
        const keys = Object.keys(props ?? {});
        this.length = keys.length;
        keys.forEach((prop, index) => {
            const attr = { name: prop, value: props[prop] };
            this[index] = attr;
        });
    }
}
export class BlFragment {
    childNodes;
    nodeType = 11;
    constructor(childNodes) {
        this.childNodes = childNodes;
    }
}
export class BlElement {
    nodeName;
    attributes;
    childNodes;
    nodeType = 1;
    constructor(nodeName, attributes, childNodes) {
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.childNodes = childNodes;
    }
    hasAttribute(name) {
        const attrs = this.attributes;
        for (let i = 0, l = attrs.length; i < l; i += 1) {
            if (attrs[i].name === name)
                return true;
        }
        return false;
    }
    getAttribute(name) {
        const attrs = this.attributes;
        for (let i = 0, l = attrs.length; i < l; i += 1) {
            if (attrs[i].name === name)
                return attrs[i].value;
        }
        return null;
    }
    setAttribute(name, value) {
        const attrs = this.attributes;
        for (let i = 0, l = attrs.length; i < l; i += 1) {
            if (attrs[i].name === name) {
                attrs[i].value = value;
                break;
            }
        }
    }
    removeAttribute(name) {
        const attrs = Array.prototype.slice.call(this.attributes);
        let flag = false;
        for (let i = 0, l = attrs.length; i < l; i += 1) {
            if (flag) {
                attrs[i - 1] = attrs[i];
                continue;
            }
            if (attrs[i].name === name) {
                flag = true;
            }
        }
    }
}
export class BlTemplate extends BlElement {
    content;
    constructor(content) {
        super('TEMPLATE', { length: 0 }, { length: 0 });
        this.content = content;
    }
}
export class BlText {
    nodeValue;
    nodeType = 3;
    constructor(nodeValue) {
        this.nodeValue = nodeValue;
    }
}
export function isElem(node) {
    return node.nodeType === 1;
}
export function isFragment(node) {
    return node.nodeType === 11;
}
export function isText(node) {
    return node.nodeType === 3;
}
export function hasAttr(node, name) {
    if (node.attributes) {
        const attrs = node.attributes;
        for (let i = 0, l = attrs.length; i < l; i += 1) {
            const attr = attrs[i];
            if (attr.name === name)
                return true;
        }
        return false;
    }
    if (node.hasAttribute) {
        return node.hasAttribute(name);
    }
    return false;
}
export function getAttr(node, name) {
    return node.getAttribute(name);
}
export function getAttrs(node) {
    return node.attributes;
}
export function children(node) {
    return Array.from(node.childNodes);
}
