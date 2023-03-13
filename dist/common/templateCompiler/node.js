var NodeType;
(function (NodeType) {
    NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeType[NodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(NodeType || (NodeType = {}));
export function isElem(node) {
    return node.nodeType === 1;
}
export function isFragment(node) {
    return node.nodeType === 11;
}
export function isText(node) {
    return node.nodeType === 3;
}
export function getAttr(node, name) {
    if (node.attrs) {
        return node.attrs.find(item => item.name === name)?.value ?? null;
    }
    if (node.getAttribute) {
        return node.getAttribute(name);
    }
    return '';
}
export function getAttrs(node) {
    if (node.attrs) {
        return node.attrs;
    }
    if (node.getAttributeNames) {
        return node.getAttributeNames().map(name => {
            const value = node.getAttribute(name);
            return { name, value };
        });
    }
    return [];
}
export function makeEventFlag(flags) {
    let eventFlag = 0;
    flags.forEach(flag => {
        switch (flag) {
            case 'capture':
                eventFlag |= 0b00000001;
                break;
            case 'prevent':
                eventFlag |= 0b00000010;
                break;
            case 'stop':
                eventFlag |= 0b00000100;
                break;
            case 'stopImmediate':
                eventFlag |= 0b00001000;
                break;
            case 'once':
                eventFlag |= 0b00010000;
                break;
            case 'passive':
                eventFlag |= 0b00100000;
                break;
        }
    });
    return eventFlag;
}
export function parseText(text = '') {
    const results = [];
    const len = text.length;
    let substr = '';
    let i = -1;
    let startPos = -1;
    while (++i < len) {
        const ch = text[i];
        if (ch === '{') {
            if (substr) {
                results.push({ type: 'static', textContent: substr });
            }
            startPos = i;
            substr = '{';
            continue;
        }
        if (ch === '}') {
            if (startPos !== -1 && /\s*\S+\s*/i.test(substr)) {
                results.push({ type: 'reactive', propName: substr.slice(1) });
                startPos = -1;
                substr = '';
                continue;
            }
        }
        substr += ch;
    }
    if (substr) {
        results.push({ type: 'static', textContent: substr });
    }
    const reduceResults = [];
    results.forEach(item => {
        const last = reduceResults[reduceResults.length - 1];
        if (!last) {
            return reduceResults.push(item);
        }
        if (last.type === 'static' && item.type === 'static') {
            last.textContent += item.textContent;
        }
        else {
            reduceResults.push(item);
        }
    });
    return reduceResults;
}
export function eachChild(node, fn) {
    for (let i = 0, length = node.childNodes.length; i < length; i += 1) {
        const child = node.childNodes[i];
        if (isElem(child) || isText(child)) {
            fn(child);
        }
    }
}
export function children(node) {
    return Array.from(node.childNodes);
}
