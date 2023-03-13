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
function path(str) {
    const output = [];
    let word = '';
    let start = false;
    let quotation = '';
    const emit = () => {
        if (word) {
            output.push(word);
            word = '';
        }
        start = false;
        quotation = '';
    };
    const len = str.length;
    main: for (let i = 0; i < str.length; i += 1) {
        const ch = str[i];
        if (ch === '.' && !start) {
            emit();
            continue;
        }
        if (!quotation && ch === '[') {
            let j = i + 1;
            for (; j < len; j += 1) {
                if (str[j] === ' ')
                    continue;
                if (str[j] === "'" || str[j] === '"') {
                    emit();
                    start = true;
                    quotation = str[j];
                    i = j;
                    continue main;
                }
                break;
            }
        }
        if (start && ch === quotation) {
            let j = i + 1;
            for (; j < len; j += 1) {
                if (str[j] === ' ')
                    continue;
                if (str[j] === ']') {
                    emit();
                    i = j;
                    continue main;
                }
                break;
            }
        }
        word += ch;
    }
    if (word)
        output.push(word);
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
            return `${envName}.${dataKey}`;
        }
        const ret = `resolve(${envName}, ${path(dataKey)
            .map(key => JSON.stringify(key))
            .join(', ')})`;
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
    return rawDataKey.startsWith(env.name + '.') ? rawDataKey.slice(env.name.length + 1) : rawDataKey;
}
