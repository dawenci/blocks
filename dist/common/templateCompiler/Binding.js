export var BindingType;
(function (BindingType) {
    BindingType[BindingType["Attr"] = 0] = "Attr";
    BindingType[BindingType["Text"] = 1] = "Text";
    BindingType[BindingType["Event"] = 2] = "Event";
    BindingType[BindingType["If"] = 3] = "If";
    BindingType[BindingType["For"] = 4] = "For";
    BindingType[BindingType["Html"] = 5] = "Html";
})(BindingType || (BindingType = {}));
function isSimpleName(name) {
    return /^[_$a-z][_$a-z0-9]*$/i.test(name);
}
const DOT = 46;
const BRACKET_START = 91;
const BRACKET_END = 93;
const DOUBLE_QUOTATION = 34;
const SINGLE_QUOTATION = 39;
const SPACE = 32;
function path(str) {
    const output = [];
    let start = false;
    let quotation = 0;
    let sliceFrom = 0;
    const len = str.length;
    main: for (let i = 0; i < str.length; i += 1) {
        const ch = str.charCodeAt(i);
        if (ch === DOT && !start) {
            if (i > sliceFrom) {
                output.push(str.slice(sliceFrom, i));
            }
            sliceFrom = i + 1;
            continue;
        }
        if (!quotation && ch === BRACKET_START) {
            let j = i + 1;
            for (; j < len; j += 1) {
                const ch2 = str.charCodeAt(j);
                if (ch2 === SPACE)
                    continue;
                if (ch2 === SINGLE_QUOTATION || ch2 === DOUBLE_QUOTATION) {
                    if (i > sliceFrom) {
                        output.push(str.slice(sliceFrom, i));
                    }
                    start = true;
                    quotation = ch2;
                    i = j;
                    sliceFrom = i + 1;
                    continue main;
                }
                break;
            }
        }
        if (start && ch === quotation) {
            let j = i + 1;
            for (; j < len; j += 1) {
                const ch2 = str.charCodeAt(j);
                if (ch2 === SPACE)
                    continue;
                if (ch2 === BRACKET_END) {
                    if (i > sliceFrom) {
                        output.push(str.slice(sliceFrom, i));
                    }
                    start = false;
                    quotation = 0;
                    i = j;
                    sliceFrom = i + 1;
                    continue main;
                }
                break;
            }
        }
    }
    if (sliceFrom < len) {
        output.push(str.slice(sliceFrom));
    }
    return output;
}
class BindingBase {
    isIndex;
    get env() {
        return getEnv(this);
    }
    get envName() {
        return this.env.name;
    }
    get dataKey() {
        return getDataKey(this);
    }
    get resolved() {
        const { envName, dataKey } = this;
        if (isSimpleName(dataKey)) {
            return `resolve(envs.${envName},${JSON.stringify(dataKey)})`;
        }
        const ret = `resolve(envs.${envName},${path(dataKey)
            .map(key => JSON.stringify(key))
            .join(',')})`;
        return ret;
    }
}
export class IfBinding extends BindingBase {
    context;
    childCtx;
    varName;
    rawDataKey;
    type = 3;
    constructor(context, childCtx, varName, rawDataKey) {
        super();
        this.context = context;
        this.childCtx = childCtx;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
    }
}
export class AttrBinding extends BindingBase {
    context;
    varName;
    rawDataKey;
    attrName;
    attrVal;
    isProp;
    type = 0;
    constructor(context, varName, rawDataKey, attrName, attrVal, isProp) {
        super();
        this.context = context;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
        this.attrName = attrName;
        this.attrVal = attrVal;
        this.isProp = isProp;
    }
}
export class EventBinding extends BindingBase {
    context;
    varName;
    rawDataKey;
    attrVal;
    eventType;
    eventFlag;
    type = 2;
    constructor(context, varName, rawDataKey, attrVal, eventType, eventFlag) {
        super();
        this.context = context;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
        this.attrVal = attrVal;
        this.eventType = eventType;
        this.eventFlag = eventFlag;
    }
}
export class TextBinding extends BindingBase {
    context;
    varName;
    rawDataKey;
    type = 1;
    constructor(context, varName, rawDataKey) {
        super();
        this.context = context;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
    }
}
export class ForBinding extends BindingBase {
    context;
    forCtx;
    varName;
    rawDataKey;
    type = 4;
    constructor(context, forCtx, varName, rawDataKey) {
        super();
        this.context = context;
        this.forCtx = forCtx;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
    }
}
export class HtmlBinding extends BindingBase {
    context;
    childCtx;
    varName;
    rawDataKey;
    type = 5;
    constructor(context, childCtx, varName, rawDataKey) {
        super();
        this.context = context;
        this.childCtx = childCtx;
        this.varName = varName;
        this.rawDataKey = rawDataKey;
    }
}
export function getEnv(binding) {
    if (!binding.rawDataKey.includes('.')) {
        return binding.context.envs[0];
    }
    const prefix = binding.rawDataKey.split('.')[0].trim();
    return binding.context.envs.findLast(env => env.rawName === prefix) ?? binding.context.envs[0];
}
export function getDataKey(binding) {
    const env = getEnv(binding);
    const rawDataKey = binding.rawDataKey.trim();
    return rawDataKey.startsWith(env.rawName + '.') ? rawDataKey.slice(env.rawName.length + 1) : rawDataKey;
}
