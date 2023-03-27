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
export function hasAttr(node, name) {
    if (node.attrs) {
        return node.attrs.some(item => item.name === name);
    }
    if (node.hasAttribute) {
        return node.hasAttribute(name);
    }
    return false;
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
const BRACE_START = 123;
const BRACE_END = 125;
const DOUBLE_QUOTATION = 34;
const SINGLE_QUOTATION = 39;
const BACKSLASH = 92;
export function parseText(text = '') {
    const results = [];
    const len = text.length;
    let top = null;
    let escape = false;
    let strStart = 0;
    let sliceFrom = 0;
    let i = -1;
    let startPos = -1;
    while (++i < len) {
        const ch = text.charCodeAt(i);
        if (ch === BRACE_START && !strStart) {
            if (i > sliceFrom) {
                if (top) {
                    top.textContent += text.slice(sliceFrom, i);
                }
                else {
                    results.push((top = { type: 'static', textContent: text.slice(sliceFrom, i) }));
                }
            }
            startPos = sliceFrom = i;
            continue;
        }
        if (ch === BRACE_END && startPos !== -1 && !strStart) {
            if (i > sliceFrom) {
                results.push({ type: 'reactive', propName: text.slice(sliceFrom + 1, i) });
                top = null;
                startPos = -1;
                sliceFrom = i + 1;
                continue;
            }
        }
        if ((ch === SINGLE_QUOTATION || ch === DOUBLE_QUOTATION) && startPos !== -1) {
            if (strStart) {
                if (ch === strStart) {
                    if (!escape) {
                        strStart = 0;
                    }
                    else {
                        escape = false;
                    }
                }
            }
            else {
                strStart = ch;
            }
        }
        if (ch === BACKSLASH && strStart && !escape) {
            escape = true;
        }
    }
    if (sliceFrom < i) {
        if (top) {
            top.textContent += text.slice(sliceFrom);
        }
        else {
            results.push((top = { type: 'static', textContent: text.slice(sliceFrom) }));
        }
    }
    return results;
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
