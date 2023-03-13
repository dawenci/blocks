import * as runtime from './runtime/index.js';
import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX } from './constants.js';
import { EnvRecord } from './EnvRecord.js';
export var ContextType;
(function (ContextType) {
    ContextType[ContextType["Root"] = 0] = "Root";
    ContextType[ContextType["If"] = 1] = "If";
    ContextType[ContextType["For"] = 2] = "For";
    ContextType[ContextType["Html"] = 3] = "Html";
})(ContextType || (ContextType = {}));
export class ContextBase {
    spaceSize = '    ';
    _code = '';
    _codes = [];
    _eIndex = 0;
    _tIndex = 0;
    _ifIndex = 0;
    _forIndex = 0;
    _htmlIndex = 0;
    _indent = 0;
    _binding = [];
    _rootCtx = this;
    _parentCtx = this;
    _childrenCtx = [];
    _envs = [];
    _childBlockMakerCodes = [];
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
    get env() {
        return this._envs[this._envs.length - 1];
    }
    get envName() {
        return this.env.name;
    }
    get envs() {
        return this.isRoot() ? this._envs : [...new Set(this.parentCtx.envs.concat(this._envs))];
    }
    get envNames() {
        return this.envs.map(item => item.name).join(', ');
    }
    allVars = [];
    topLevelVars = [];
    isRoot() {
        return this instanceof RootContext;
    }
    get code() {
        return this._code;
    }
    get indentSpaces() {
        return this.repeat(this.spaceSize, this.indent);
    }
    get indent() {
        return this._indent;
    }
    set indent(n) {
        this._indent = n;
    }
    repeat(c, n) {
        let ret = '';
        while (n--) {
            ret += c;
        }
        return ret;
    }
    declareIf(isTop = false) {
        const name = `${IF_PREFIX}${++this._ifIndex}`;
        this.allVars.push(name);
        this.allVars.push(`${name}_com`);
        this.allVars.push(`${name}_val`);
        if (isTop)
            this.topLevelVars.push(name);
        return name;
    }
    declareFor(isTop = false) {
        const name = `${FOR_PREFIX}${++this._forIndex}`;
        this.allVars.push(name);
        this.allVars.push(`${name}_blocks`);
        this.allVars.push(`${name}_val`);
        if (isTop)
            this.topLevelVars.push(name);
        return name;
    }
    declareHtml(isTop = false) {
        const name = `${HTML_PREFIX}${++this._htmlIndex}`;
        this.allVars.push(name);
        this.allVars.push(`${name}_com`);
        this.allVars.push(`${name}_val`);
        if (isTop)
            this.topLevelVars.push(name);
        return name;
    }
    declareElement(isTop = false) {
        const name = `${ELEMENT_PREFIX}${++this._eIndex}`;
        this.allVars.push(name);
        if (isTop)
            this.topLevelVars.push(name);
        return name;
    }
    declareText(isTop = false) {
        const name = `${TEXT_PREFIX}${++this._tIndex}`;
        this.allVars.push(name, name + '_val');
        if (isTop)
            this.topLevelVars.push(name);
        return name;
    }
    declareAttr(elName, attrName) {
        const name = `${elName}_${attrName}`;
        this.allVars.push(name);
        return name;
    }
    getCodeDeclareVars() {
        return this.indentSpaces + 'var ' + this.allVars.join(',') + '\n';
    }
    addBinding(binding) {
        this._binding.push(binding);
    }
    indentLines(code, indent = 0) {
        const spaces = this.repeat(this.spaceSize, indent);
        return (spaces +
            code.trim().replaceAll(/\n/g, newline => {
                return newline + spaces;
            }));
    }
    appendCode(code) {
        this._code += code;
    }
    prependCode(code) {
        this._code = code + this._code;
    }
    prependLine(line) {
        this.prependCode(this.indentSpaces + line + '\n');
    }
    appendLine(line) {
        this.appendCode(this.indentSpaces + line + '\n');
    }
    blockStart(line) {
        this.appendLine(line);
        this._indent += 1;
    }
    blockEnd(line) {
        this._indent -= 1;
        this.appendLine(line);
    }
    blockEndAndStart(line) {
        this._indent -= 1;
        this.appendLine(line);
        this._indent += 1;
    }
}
class IfContext extends ContextBase {
    static uid = 0;
    type = 1;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey) {
        super();
        this._indent = 1;
        this.varName = varName;
        this.dataKey = dataKey;
        this.makeFuncName = `/*If:${dataKey}*/make_if_${++IfContext.uid}`;
    }
}
export { IfContext };
export class RootContext extends ContextBase {
    type = 0;
    constructor() {
        super();
        this._envs = [EnvRecord.root()];
    }
    compile() {
        return new Function('{dom, noop, resolve }', '{ data } = {}', this.code).bind(null, Object.assign(runtime));
    }
}
class ForContext extends ContextBase {
    static uid = 0;
    type = 2;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey, newEnv) {
        super();
        this._indent = 1;
        this.varName = varName;
        this.dataKey = dataKey;
        this._envs.push(EnvRecord.for(newEnv));
        this.makeFuncName = `/*For:${dataKey}*/make_for_${++ForContext.uid}`;
    }
}
export { ForContext };
class HtmlContext extends ContextBase {
    static uid = 0;
    type = 3;
    varName;
    dataKey;
    makeFuncName;
    constructor(varName, dataKey) {
        super();
        this._indent = 1;
        this.varName = varName;
        this.dataKey = dataKey;
        this.makeFuncName = `/*Html:${dataKey}*/make_html_${++HtmlContext.uid}`;
    }
}
export { HtmlContext };
