import * as BlNode from './node.js';
import { IfBinding, ForBinding, HtmlBinding, AttrBinding, EventBinding, TextBinding } from './Binding.js';
import { IfContext, ForContext, HtmlContext, RootContext } from './Context.js';
import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX } from './constants.js';
import { Code } from './Code.js';
let bindAttrKeyword = 'bl-attr';
let bindPropKeyword = 'bl-prop';
let bindEventKeyword = 'bl-on';
let bindingRecordSeperator = ',';
let bindingKeySeperator = '<-';
let bindingFlagSeperator = '.';
export function setup(options = {}) {
    if (options.bindAttrKeyword)
        bindAttrKeyword = options.bindAttrKeyword;
    if (options.bindPropKeyword)
        bindPropKeyword = options.bindPropKeyword;
    if (options.bindEventKeyword)
        bindEventKeyword = options.bindEventKeyword;
    if (options.bindingRecordSeperator)
        bindingRecordSeperator = options.bindingRecordSeperator;
    if (options.bindingKeySeperator)
        bindingKeySeperator = options.bindingKeySeperator;
    if (options.bindingFlagSeperator)
        bindingFlagSeperator = options.bindingFlagSeperator;
}
var BlTag;
(function (BlTag) {
    BlTag["If"] = "IF";
    BlTag["For"] = "FOR";
    BlTag["Rich"] = "RICH";
    BlTag["Text"] = "T";
})(BlTag || (BlTag = {}));
var BlockStatus;
(function (BlockStatus) {
    BlockStatus[BlockStatus["BeforeInit"] = 0] = "BeforeInit";
    BlockStatus[BlockStatus["Created"] = 1] = "Created";
    BlockStatus[BlockStatus["Destroyed"] = 2] = "Destroyed";
})(BlockStatus || (BlockStatus = {}));
class RootGenerator {
    static emitConstructor($nodes) {
        const rootCtx = new RootContext();
        const codeMaker = rootCtx.codeMaker;
        codeMaker
            .appendLine(`var alive=${0}`)
            .appendLine(`var e0=dom.fragment()`)
            .appendLine(`var envs={${rootCtx.envName}:model??new BlModel({})}`)
            .appendLine('var ev=new BlEvent()');
        generateCreateFunction(rootCtx, $nodes, 'e0');
        generateUpdateFunction(rootCtx);
        generateDestroyFunction(rootCtx);
        generateSetModelFunction(rootCtx);
        generateReturn(rootCtx);
        codeMaker.prependLine(`var ${rootCtx.getAllVars(',')}`);
        codeMaker.indent -= 1;
        codeMaker.prependLine(`function make_root(){`).appendLine(`}`);
        return rootCtx;
    }
}
class IfGenerator {
    static emitConstructor(ifCtx, $nodes) {
        const codeMaker = ifCtx.codeMaker;
        codeMaker.appendLine(`var alive=${0}`).appendLine(`var e0=dom.fragment()`);
        generateCreateFunction(ifCtx, $nodes, 'e0');
        generateUpdateFunction(ifCtx);
        generateDestroyFunction(ifCtx);
        generateSetModelFunction(ifCtx);
        generateReturn(ifCtx);
        codeMaker
            .prependLine(`var ev=new BlEvent()`)
            .prependLine(`var ${ifCtx.getAllVars(',')}`);
        codeMaker.indent -= 1;
        codeMaker.prependLine(`function ${ifCtx.makeFuncName}(envs){`).appendLine(`}`);
        ifCtx.rootCtx._childBlockMakerCodes.push(ifCtx.getCode());
        return this;
    }
    static emitCreate(ctx, ifCtx, varName, dataKey, mountPoint) {
        const codeMaker = ctx.codeMaker;
        const binding = new IfBinding(ctx, ifCtx, varName, dataKey);
        ctx.addBinding(binding);
        codeMaker
            .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('if:${dataKey}'))`)
            .appendLine(`${varName}_com=${ifCtx.makeFuncName}(envs)`)
            .blockStart(`if (${varName}_val=${binding.resolved}) {`)
            .appendLine(`dom.before(${varName}, ${varName}_com.create())`)
            .blockEnd(`}`);
        return this;
    }
    static emitUpdate(ctx, binding) {
        const { varName } = binding;
        ctx.codeMaker
            .appendLine(`var ${varName}_rebuild=false`)
            .blockStart(`if (${varName}_val!==(${varName}_val=${binding.resolved})) {`)
            .blockStart(`if (${varName}_val) {`)
            .appendLine(`dom.before(${varName}, ${varName}_com.create())`)
            .blockEndAndStart(`} else {`)
            .appendLine(`${varName}_com.destroy()`)
            .blockEnd(`}`)
            .appendLine(`${varName}_rebuild=true`)
            .blockEnd(`}`);
        const ifCtx = binding.childCtx;
        if (!ifCtx.isStatic) {
            const instance = `${ifCtx.varName}_com`;
            ctx.codeMaker.appendLine(`if (!${ifCtx.varName}_rebuild) /*${ifCtx.dataKey}*/${instance}.update()`);
        }
        return this;
    }
}
class ForGenerator {
    static emitConstructor(forCtx, $nodes) {
        const codeMaker = forCtx.codeMaker;
        codeMaker.appendLine(`var alive=${0}`).appendLine(`var e0=dom.fragment()`);
        generateCreateFunction(forCtx, $nodes, 'e0');
        generateUpdateFunction(forCtx);
        generateDestroyFunction(forCtx);
        generateSetModelFunction(forCtx);
        generateReturn(forCtx);
        codeMaker
            .prependLine(`var ev=new BlEvent()`)
            .prependLine(`var ${forCtx.getAllVars(',')}`);
        codeMaker.indent -= 1;
        codeMaker.prependLine(`function ${forCtx.makeFuncName}(envs){`).appendLine(`}`);
        forCtx.rootCtx._childBlockMakerCodes.push(forCtx.getCode());
        return this;
    }
    static emitCreate(ctx, forCtx, varName, dataKey, mountPoint) {
        const codeMaker = ctx.codeMaker;
        const binding = new ForBinding(ctx, forCtx, varName, dataKey);
        ctx.addBinding(binding);
        const fnName = forCtx.makeFuncName;
        const args = `Object.assign(Object.create(envs),{${forCtx.envName}:item})`;
        codeMaker
            .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('for:${dataKey}'))`)
            .appendLine(`${varName}_val=${binding.resolved}??[]`)
            .blockStart(`${varName}_blocks=${varName}_val.map((item,i)=>{`)
            .appendLine(`var instance=${fnName}(${args})`)
            .appendLine(`dom.before(${varName},instance.create())`)
            .appendLine(`return instance`)
            .blockEnd(`})`);
        return this;
    }
    static emitUpdate(ctx, binding) {
        const codeMaker = ctx.codeMaker;
        const { varName, forCtx } = binding;
        const fnName = binding.forCtx.makeFuncName;
        const args = `Object.assign(Object.create(envs),{${binding.forCtx.envName}:item})`;
        codeMaker
            .appendLine(`var ${varName}_rebuild = false`)
            .blockStart(`if (${varName}_val!==(${varName}_val=${binding.resolved})) {`)
            .appendLine(`var list=${binding.resolved}??[]`)
            .appendLine(`var blocks=${varName}_blocks`)
            .blockStart(`for (var i=0,l=Math.min(list.length,blocks.length);i<l;i+=1) {`)
            .appendLine(`blocks[i].set(list[i])`)
            .blockEnd(`}`)
            .appendLine(`while(blocks.length>list.length) blocks.pop().destroy()`)
            .blockStart(`while(list.length>blocks.length) {`)
            .appendLine(`var i=blocks.length`)
            .appendLine(`var item=list[i]`)
            .appendLine(`var instance=${fnName}(${args})`)
            .appendLine(`blocks.push(instance)`)
            .appendLine(`dom.before(${varName},instance.create())`)
            .blockEnd(`}`)
            .appendLine(`${varName}_rebuild = true`)
            .blockEnd(`}`);
        if (forCtx.hasFreeBinding) {
            codeMaker
                .blockStart(`if (!${forCtx.varName}_rebuild){`)
                .appendLine(`for(let i=0,l=${forCtx.varName}_blocks.length;i<l;i+=1) ${forCtx.varName}_blocks[i].update()`)
                .blockEnd(`}`);
        }
        return this;
    }
}
class HtmlGenerator {
    static emitConstructor(ctx, htmlCtx, dataKey) {
        const code = `function ${htmlCtx.makeFuncName}(envs){
    var alive=${0}
    var e0=dom.fragment()
    var html
    var nodes=[]
    var create=()=>{
        alive=${1}
        html=resolve(envs.${ctx.envName},${JSON.stringify(dataKey)})??''
        nodes=dom.parseHtml(html)
        nodes.forEach(node=>dom.append(e0,node))
        return e0
    }
    var update=()=>{
        if (alive!==${1}) return
        if (html!==(html=resolve(envs.${ctx.envName},${JSON.stringify(dataKey)})??'')){
          nodes.forEach(node=>dom.detach(node))
          nodes=dom.parseHtml(html)
          nodes.forEach(node=>dom.append(e0,node))
        }
        return e0
    }
    var destroy=()=>{
        if (alive!==${1}) return
        nodes.forEach(node=>dom.detach(node))
        nodes=[]
        html=void 0
        alive=${2}
    }
    var set=(model)=>{}
    return {create,update,destroy,set}
}`;
        htmlCtx.codeMaker.appendCode(ctx.codeMaker.indentLines(code, 0) + '\n');
        htmlCtx.rootCtx._childBlockMakerCodes.push(htmlCtx.getCode());
        return this;
    }
    static emitCreate(context, htmlCtx, varName, dataKey, mountPoint) {
        const codeMaker = context.codeMaker;
        const binding = new HtmlBinding(context, htmlCtx, varName, dataKey);
        context.addBinding(binding);
        codeMaker
            .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('rich:${dataKey}'))`)
            .appendLine(`${varName}_com=${htmlCtx.makeFuncName}(envs)`)
            .blockStart(`if (${binding.resolved}) {`)
            .appendLine(`dom.before(${varName},${varName}_com.create())`)
            .blockEnd(`}`);
        return this;
    }
    static emitUpdate(ctx, binding) {
        const { varName } = binding;
        ctx.codeMaker.appendLine(`dom.before(${varName},${varName}_com.update())`);
        return this;
    }
}
class ElementGenerator {
    static emitCreate(ctx, $node, isTop, mountPoint = 'e0') {
        const codeMaker = ctx.codeMaker;
        const varName = ctx.declareElement(isTop);
        codeMaker.appendLine(`${varName}=dom.append(${mountPoint},dom.element('${$node.nodeName}'))`);
        const parsedAttrs = parseAttrs(BlNode.getAttrs($node));
        for (let i = 0, m = parsedAttrs.length; i < m; i += 1) {
            const parsedAttr = parsedAttrs[i];
            switch (parsedAttr.type) {
                case 'static': {
                    const attrValue = JSON.stringify(parsedAttr.value);
                    codeMaker.appendLine(`dom.attr(${varName},'${parsedAttr.name}',${attrValue})`);
                    break;
                }
                case 'binding': {
                    const attrName = parsedAttr.name;
                    const dataKey = parsedAttr.value;
                    const isProp = parsedAttr.isProp;
                    const attrVal = ctx.declareAttr();
                    const binding = new AttrBinding(ctx, varName, dataKey, attrName, attrVal, !!isProp);
                    ctx.addBinding(binding);
                    if (isProp) {
                        codeMaker.appendLine(`dom.prop(${binding.varName},'${binding.attrName}',(${attrVal}=${binding.resolved}))`);
                    }
                    else {
                        codeMaker
                            .appendLine(`${attrVal}=${binding.resolved}`)
                            .appendLine(`if (${attrVal}!=null) dom.attr(${binding.varName},'${binding.attrName}',${attrVal})`);
                    }
                    break;
                }
                case 'event': {
                    const { name: eventType, value: dataKey, eventFlag } = parsedAttr;
                    const attrVal = ctx.declareAttr();
                    const binding = new EventBinding(ctx, varName, dataKey, attrVal, eventType, eventFlag);
                    ctx.addBinding(binding);
                    codeMaker
                        .appendLine(`${attrVal}=${binding.resolved}`)
                        .appendLine(`if (${attrVal}) dom.event(${binding.varName},'${binding.eventType}',${attrVal},${binding.eventFlag})`);
                    break;
                }
            }
        }
        const $children = $node.childNodes;
        for (let i = 0, length = $children.length; i < length; i += 1) {
            const $child = $children[i];
            if ($child.nodeType === 1 || $child.nodeType === 3) {
                recursivelyCreateByNode(ctx, $child, false, varName);
            }
        }
        return this;
    }
    static emitAttrUpdate(ctx, binding) {
        const codeMaker = ctx.codeMaker;
        const { varName, attrName, attrVal, isProp } = binding;
        if (isProp) {
            codeMaker.appendLine(`if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.prop(${varName},'${attrName}',${attrVal})`);
        }
        else {
            codeMaker.appendLine(`if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.attr(${varName},'${attrName}',${attrVal})`);
        }
        return this;
    }
    static emitEventUpdate(ctx, binding) {
        const { varName, eventType, eventFlag, attrVal } = binding;
        ctx.codeMaker.appendLine(`if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.event(${varName},'${eventType}',${attrVal},${eventFlag})`);
        return this;
    }
}
class TextGenerator {
    static emitCreate(ctx, text, reactive, isTop, mountPoint = 'e0') {
        const codeMaker = ctx.codeMaker;
        if (reactive) {
            const varName = ctx.declareText(isTop);
            const dataKey = text;
            const binding = new TextBinding(ctx, varName, dataKey);
            ctx.addBinding(binding);
            codeMaker
                .appendLine(`${varName}_val=${binding.resolved} ?? ''`)
                .appendLine(`${varName}=dom.append(${mountPoint},dom.text(${varName}_val))`);
        }
        else {
            if (isTop) {
                const varName = ctx.declareText(isTop);
                codeMaker.appendLine(`${varName}=dom.append(${mountPoint},dom.text(${text}))`);
            }
            else {
                codeMaker.appendLine(`dom.append(${mountPoint},dom.text(${text}))`);
            }
        }
        return this;
    }
    static emitUpdate(ctx, binding) {
        const { varName } = binding;
        ctx.codeMaker.appendLine(`if (${varName}_val!==(${varName}_val=${binding.resolved})) ${varName}.nodeValue=${varName}_val`);
        return this;
    }
}
function recursivelyCreateByNode(ctx, $node, isTop, mountPoint = 'e0') {
    if (BlNode.isElem($node)) {
        switch ($node.nodeName) {
            case "IF": {
                const dataKey = BlNode.getAttr($node, 'cond');
                if (dataKey == null) {
                    ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint);
                    return;
                }
                const varName = ctx.declareIf(isTop);
                const ifCtx = new IfContext(varName, dataKey, ctx);
                IfGenerator.emitConstructor(ifCtx, BlNode.children($node)).emitCreate(ctx, ifCtx, varName, dataKey, mountPoint);
                return;
            }
            case "FOR": {
                const dataKey = BlNode.getAttr($node, 'each');
                const newEnv = BlNode.getAttr($node, 'as');
                if (!newEnv || !dataKey) {
                    ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint);
                    return;
                }
                const varName = ctx.declareFor(isTop);
                const forCtx = new ForContext(varName, dataKey, newEnv, ctx);
                ForGenerator.emitConstructor(forCtx, BlNode.children($node)).emitCreate(ctx, forCtx, varName, dataKey, mountPoint);
                return;
            }
            case "T": {
                if (BlNode.hasAttr($node, 'text')) {
                    const dataKey = BlNode.getAttr($node, 'text') ?? '';
                    TextGenerator.emitCreate(ctx, dataKey, true, isTop, mountPoint);
                    return;
                }
            }
            case "RICH": {
                if (BlNode.hasAttr($node, 'html')) {
                    const dataKey = BlNode.getAttr($node, 'html');
                    if (!dataKey) {
                        ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint);
                        return;
                    }
                    const varName = ctx.declareHtml(isTop);
                    const htmlCtx = new HtmlContext(varName, dataKey, ctx);
                    HtmlGenerator.emitConstructor(ctx, htmlCtx, dataKey).emitCreate(ctx, htmlCtx, varName, dataKey, mountPoint);
                    return;
                }
            }
            case 'TEMPLATE': {
                const childNodes = $node.content.childNodes;
                for (let i = 0; i < childNodes.length; i += 1) {
                    recursivelyCreateByNode(ctx, childNodes[i], isTop, mountPoint);
                }
                return;
            }
            default: {
                ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint);
                return;
            }
        }
    }
    if (BlNode.isText($node)) {
        const text = ($node.nodeValue ?? '').trim();
        if (!text)
            return;
        TextGenerator.emitCreate(ctx, JSON.stringify(text), false, isTop, mountPoint);
    }
}
function generateCreateFunction(ctx, nodes, mountPoint) {
    const codeMaker = ctx.codeMaker;
    codeMaker.blockStart('var create=()=>{').appendLine(`alive=${1}`);
    nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint));
    if (ctx.type === 0 || ctx.type === 2) {
        ctx._ownDepEnvNames.forEach(envName => {
            codeMaker.appendLine(`if (envs.${envName} instanceof BlEvent) ev.listenTo(envs.${envName},'change',()=>update())`);
        });
    }
    codeMaker.appendLine(`return e0`).blockEnd('}');
}
function generateUpdateFunction(ctx) {
    const codeMaker = ctx.codeMaker;
    codeMaker.blockStart('var update=()=>{').appendLine(`if (alive!==${1}) return`);
    ctx._ownBindings.forEach(item => {
        switch (item.type) {
            case 0: {
                ElementGenerator.emitAttrUpdate(ctx, item);
                break;
            }
            case 1: {
                TextGenerator.emitUpdate(ctx, item);
                break;
            }
            case 4: {
                ForGenerator.emitUpdate(ctx, item);
                break;
            }
            case 3: {
                IfGenerator.emitUpdate(ctx, item);
                break;
            }
            case 2: {
                ElementGenerator.emitEventUpdate(ctx, item);
                break;
            }
            case 5: {
                HtmlGenerator.emitUpdate(ctx, item);
                break;
            }
        }
    });
    codeMaker.blockEnd('}');
}
function generateDestroyFunction(ctx) {
    const codeMaker = ctx.codeMaker;
    codeMaker.blockStart('var destroy=()=>{').appendLine(`if (alive!==${1}) return`);
    ctx._ownBindings
        .filter(item => item.type === 2)
        .forEach(binding => {
        const { varName, eventType, eventFlag } = binding;
        codeMaker.appendLine('dom.event(' + varName + ',' + JSON.stringify(eventType) + ',null,' + eventFlag + ')');
    });
    let i = ctx._topFors.length;
    while (i--)
        codeMaker.appendLine(FOR_PREFIX + ctx._topFors[i] + '_blocks.forEach(block=>block.destroy())');
    i = ctx._topIfs.length;
    while (i--)
        codeMaker.appendLine(IF_PREFIX + ctx._topIfs[i] + '_com.destroy()');
    i = ctx._topHtmls.length;
    while (i--)
        codeMaker.appendLine(HTML_PREFIX + ctx._topHtmls[i] + '_com.destroy()');
    i = ctx._topElements.length;
    while (i--)
        codeMaker.appendLine('dom.detach(' + ELEMENT_PREFIX + ctx._topElements[i] + ')');
    i = ctx._topTexts.length;
    while (i--)
        codeMaker.appendLine('dom.detach(' + TEXT_PREFIX + ctx._topTexts[i] + ')');
    if (ctx.type === 0 || ctx.type === 2)
        codeMaker.appendLine(`ev.stopListening()`);
    codeMaker
        .appendLine(ctx.getAllVars('=') + '=void 0')
        .appendLine(`alive=${2}`)
        .blockEnd('}');
}
function generateSetModelFunction(ctx) {
    const codeMaker = ctx.codeMaker;
    const isBase = ctx.type === 0 || ctx.type === 2;
    if (isBase) {
        codeMaker.blockStart('var set=(model)=>{').appendLine(`if (envs.${ctx.envName}===model) return`);
        codeMaker
            .appendLine(`if (envs.${ctx.envName} instanceof BlEvent) ev.stopListening(envs.${ctx.envName})`)
            .appendLine(`envs.${ctx.envName}=model`)
            .appendLine(`if (model instanceof BlEvent) ev.listenTo(model,'change',()=>update())`)
            .appendLine(`update()`)
            .blockEnd(`}`);
    }
    else {
        codeMaker.appendLine('var set=noop');
    }
}
function generateReturn(ctx) {
    ctx.codeMaker.appendLine(`return {set,create,update,destroy}`);
}
function parseAttrs(attrs) {
    const output = [];
    for (let i = 0, l = attrs.length; i < l; i += 1) {
        const attr = attrs[i];
        parseAttr(attr, output);
    }
    return output;
}
function parseAttr(attr, output) {
    const value = attr.value ?? '';
    let type = 'static';
    const name = attr.name;
    let eventFlag;
    let isProp = false;
    if (!value) {
        output.push({ type, isProp, name, value, eventFlag });
        return;
    }
    if (name === bindAttrKeyword) {
        type = 'binding';
        value.split(bindingRecordSeperator).forEach(b => {
            const [name, value] = b.trim().split(bindingKeySeperator);
            output.push({ type, isProp, name, value, eventFlag });
        });
        return;
    }
    if (name === bindPropKeyword) {
        type = 'binding';
        isProp = true;
        value.split(bindingRecordSeperator).forEach(b => {
            const [name, value] = b.trim().split(bindingKeySeperator);
            output.push({ type, isProp, name, value, eventFlag });
        });
        return;
    }
    if (name === bindEventKeyword) {
        type = 'event';
        value.split(bindingRecordSeperator).forEach(b => {
            const [_name, value] = b.trim().split(bindingKeySeperator);
            const [name, ...flagString] = _name.split(bindingFlagSeperator);
            eventFlag = makeEventFlag(flagString);
            output.push({ type, isProp, name, value, eventFlag });
        });
        return;
    }
    output.push({ type, isProp, name, value, eventFlag });
}
function makeEventFlag(flags) {
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
export function generateCode(root) {
    console.time('CODE_GENERATE');
    const rootCtx = RootGenerator.emitConstructor([root]);
    const codeMaker = new Code();
    codeMaker
        .appendCode(rootCtx.getCode())
        .appendCode(rootCtx._childBlockMakerCodes.join(''))
        .appendLine(`return make_root()`);
    console.timeEnd('CODE_GENERATE');
    return {
        get code() {
            return codeMaker.code;
        },
        get ctx() {
            return rootCtx;
        },
    };
}
