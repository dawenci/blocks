import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX, ATTR_PREFIX } from './constants.js';
import { EnvRecord } from './EnvRecord.js';
import { Code } from './Code.js';
export var ContextType;
(function (ContextType) {
    ContextType[ContextType["Root"] = 0] = "Root";
    ContextType[ContextType["If"] = 1] = "If";
    ContextType[ContextType["For"] = 2] = "For";
    ContextType[ContextType["Html"] = 3] = "Html";
})(ContextType || (ContextType = {}));
export class ContextBase {
    type;
    codeMaker = new Code();
    _elementCount = 0;
    _textCount = 0;
    _ifCount = 0;
    _forCount = 0;
    _htmlCount = 0;
    _attrCount = 0;
    _topElements = [];
    _topTexts = [];
    _topIfs = [];
    _topFors = [];
    _topHtmls = [];
    _ownBindings = [];
    _ownFreeBindings = [];
    _ownDepEnvNames = [];
    _envs = [];
    _rootCtx = this;
    _parentCtx = this;
    _childrenCtx = [];
    topLevelVars = [];
    get isStatic() {
        return !this._ownBindings.length && this._childrenCtx.every(ctx => ctx.isStatic);
    }
    _hasFreeBinding;
    get hasFreeBinding() {
        if (this._hasFreeBinding != null)
            return this._hasFreeBinding;
        const result = !!this._ownFreeBindings.length || this._childrenCtx.some(ctx => ctx.hasFreeBinding);
        return (this._hasFreeBinding = result);
    }
    get allFreeBindings() {
        return this._childrenCtx.reduce((acc, ctx) => {
            return acc.concat(ctx.allFreeBindings);
        }, this._ownFreeBindings);
    }
    get parentCtx() {
        return this._parentCtx;
    }
    set parentCtx(ctx) {
        this._parentCtx = ctx;
        if (ctx !== this) {
            ctx._childrenCtx.push(this);
        }
    }
    get rootCtx() {
        let ctx = this._parentCtx;
        while (ctx._parentCtx !== ctx)
            ctx = ctx._parentCtx;
        return ctx;
    }
    get closestEnvCtx() {
        const type = this.type;
        if (type === 0 || 2) {
            return this;
        }
        return this.parentCtx.closestEnvCtx;
    }
    get env() {
        return this.envs[this._envs.length - 1];
    }
    get envName() {
        return this.env.name;
    }
    get envs() {
        return this._envs;
    }
    get envNames() {
        return this.envs.map(item => item.name).join(',');
    }
    getCode() {
        return this.codeMaker.code;
    }
    declareIf(isTop = false) {
        const index = ++this._ifCount;
        const name = IF_PREFIX + index;
        if (isTop) {
            this._topIfs.push(index);
            this.topLevelVars.push(name);
        }
        return name;
    }
    declareFor(isTop = false) {
        const index = ++this._forCount;
        const name = FOR_PREFIX + index;
        if (isTop) {
            this._topFors.push(index);
            this.topLevelVars.push(name);
        }
        return name;
    }
    declareHtml(isTop = false) {
        const index = ++this._htmlCount;
        const name = HTML_PREFIX + index;
        if (isTop) {
            this._topHtmls.push(index);
            this.topLevelVars.push(name);
        }
        return name;
    }
    declareElement(isTop = false) {
        const index = ++this._elementCount;
        const name = ELEMENT_PREFIX + index;
        if (isTop) {
            this._topElements.push(index);
            this.topLevelVars.push(name);
        }
        return name;
    }
    declareText(isTop = false) {
        const index = ++this._textCount;
        const name = TEXT_PREFIX + index;
        if (isTop) {
            this._topTexts.push(index);
            this.topLevelVars.push(name);
        }
        return name;
    }
    declareAttr() {
        const name = ATTR_PREFIX + ++this._attrCount;
        return name;
    }
    getAllVars(sep) {
        let output = '';
        for (let i = 1; i <= this._elementCount; i += 1) {
            const name = ELEMENT_PREFIX + i;
            output += (output ? sep : '') + name;
        }
        for (let i = 1; i <= this._textCount; i += 1) {
            const name = TEXT_PREFIX + i;
            output += (output ? sep : '') + name + sep + name + '_val';
        }
        for (let i = 1; i <= this._ifCount; i += 1) {
            const name = IF_PREFIX + i;
            output += (output ? sep : '') + name + sep + name + '_com' + sep + name + '_val';
        }
        for (let i = 1; i <= this._forCount; i += 1) {
            const name = FOR_PREFIX + i;
            output += (output ? sep : '') + name + sep + name + '_blocks' + sep + name + '_val';
        }
        for (let i = 1; i <= this._htmlCount; i += 1) {
            const name = HTML_PREFIX + i;
            output += (output ? sep : '') + name + sep + name + '_com' + sep + name + '_val';
        }
        for (let i = 1; i <= this._attrCount; i += 1) {
            const name = ATTR_PREFIX + i;
            output += (output ? sep : '') + name;
        }
        return output;
    }
    addBinding(binding) {
        this._ownBindings.push(binding);
        if (this._ownDepEnvNames.indexOf(binding.envName) === -1) {
            this._ownDepEnvNames.push(binding.envName);
        }
        if (binding.envName !== this.envName) {
            this._ownFreeBindings.push(binding);
        }
    }
}
export class RootContext extends ContextBase {
    type = 0;
    _childBlockMakerCodes = [];
    constructor() {
        super();
        this._envs = [EnvRecord.root()];
        this.codeMaker._indent = 1;
    }
}
class IfContext extends ContextBase {
    static uid = 0;
    type = 1;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey, parentCtx) {
        super();
        this.makeFuncName = `make_if_${++IfContext.uid}/*${dataKey}*/`;
        this.varName = varName;
        this.dataKey = dataKey;
        this.parentCtx = parentCtx;
        this.codeMaker._indent = 1;
        this._envs = parentCtx.envs;
    }
}
export { IfContext };
class ForContext extends ContextBase {
    static uid = 0;
    type = 2;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey, newEnv, parentCtx) {
        super();
        this.makeFuncName = `make_for_${++ForContext.uid}/*${dataKey}*/`;
        this.varName = varName;
        this.dataKey = dataKey;
        this.parentCtx = parentCtx;
        this.codeMaker._indent = 1;
        this._envs = parentCtx.envs.concat(EnvRecord.for(newEnv));
    }
}
export { ForContext };
class HtmlContext extends ContextBase {
    static uid = 0;
    type = 3;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey, parentCtx) {
        super();
        this.makeFuncName = `make_html_${++HtmlContext.uid}/*${dataKey}*/`;
        this.varName = varName;
        this.dataKey = dataKey;
        this.parentCtx = parentCtx;
        this.codeMaker._indent = 1;
        this._envs = parentCtx.envs;
    }
}
export { HtmlContext };
