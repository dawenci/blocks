import * as BlNode from './node.js';
import { IfBinding, ForBinding, HtmlBinding, AttrBinding, EventBinding, TextBinding } from './Binding.js';
import { IfContext, ForContext, HtmlContext, RootContext } from './Context.js';
var BlockStatus;
(function (BlockStatus) {
    BlockStatus[BlockStatus["BeforeInit"] = 0] = "BeforeInit";
    BlockStatus[BlockStatus["Created"] = 1] = "Created";
    BlockStatus[BlockStatus["Destroyed"] = 2] = "Destroyed";
})(BlockStatus || (BlockStatus = {}));
class RootGenerator {
    static generateRootBlockMaker($nodes) {
        const rootCtx = new RootContext();
        generateCreateFunction(rootCtx, $nodes, 'e0');
        generateUpdateFunction(rootCtx);
        generateDestroyFunction(rootCtx);
        const code = `var set = (data = {}) => {
    Object.assign(__bl_env_root, data)
    update()
    return e0
}`;
        rootCtx.appendCode(rootCtx.indentLines(code, rootCtx.indent) + '\n');
        rootCtx.appendLine(`return { set, create, update, destroy, get $el() { return e0 }, get destroyed() { return destroyed } }`);
        rootCtx.prependLine(`var destroyed = false`);
        rootCtx.prependLine(`var ${rootCtx.allVars.join(',')}`);
        if (rootCtx._binding.length) {
            const code = `
var __bl_env_root = data || Object.create(null)
var dirty_keys = new Map()`;
            rootCtx.prependCode(rootCtx.indentLines(code, rootCtx.indent) + '\n');
        }
        rootCtx.prependLine(`var e0 = dom.fragment()`);
        rootCtx.prependLine('\n/* root start: */');
        rootCtx.prependCode(rootCtx._childBlockMakerCodes.join(''));
        return rootCtx;
    }
}
class IfGenerator {
    static generateBlockMaker(ctx, varName, dataKey, $nodes) {
        const ifCtx = new IfContext(varName, dataKey);
        ifCtx.parentCtx = ctx;
        ifCtx.appendLine(`var flag = ${0}`);
        ifCtx.appendLine(`var e0 = dom.fragment()`);
        ifCtx.blockStart('var create = () => {');
        ifCtx.appendLine(`flag = ${1}`);
        $nodes.forEach(node => recursivelyCreateByNode(ifCtx, node, true, 'e0'));
        ifCtx.appendLine(`return e0`);
        ifCtx.blockEnd('}');
        ifCtx.blockStart(`var update = () => {`);
        ifCtx.appendLine(`if (flag !== ${1}) return`);
        generateUpdateBidingFunction(ifCtx);
        generateUpdateChildrenFunction(ifCtx);
        ifCtx.appendLine('return e0');
        ifCtx.blockEnd('}');
        ifCtx.blockStart(`var destroy = () => {`);
        ifCtx.appendLine(`if (flag !== ${1}) return`);
        generateDestroyEventsFunction(ifCtx);
        ifCtx.topLevelVars.forEach(varName => {
            if (varName.startsWith('if')) {
                ifCtx.appendLine(`${varName}_com.destroy()`);
            }
            else if (varName.startsWith('html')) {
                ifCtx.appendLine(`${varName}_com.destroy()`);
            }
            else if (varName.startsWith('for')) {
                ifCtx.appendLine(`${varName}_blocks.forEach(block => block.destroy())`);
            }
            ifCtx.appendLine(`dom.detach(${varName})`);
        });
        ifCtx.appendLine(`${ifCtx.allVars.join(' = ')} = void 0`);
        ifCtx.appendLine(`flag = ${2}`);
        ifCtx.blockEnd(`}`);
        generateReturn(ifCtx);
        ifCtx.prependLine(`var ${ifCtx.allVars.join(',')}`);
        ifCtx.indent -= 1;
        ifCtx.prependLine(`var ${ifCtx.makeFuncName} = ({ ${ifCtx.envNames} }) => {`);
        ifCtx.appendLine(`}`);
        ifCtx.rootCtx._childBlockMakerCodes.push(ifCtx.code);
        return ifCtx;
    }
    static callCreate(ctx, ifCtx, mountPoint, varName, dataKey) {
        const binding = new IfBinding(ctx, ifCtx, varName, dataKey);
        ctx.addBinding(binding);
        const code = `
${varName} = dom.append(${mountPoint}, dom.comment('bl-if:${dataKey}'))
${varName}_com = ${ifCtx.makeFuncName}({ ${ifCtx.envNames} })
if (${varName}_val = ${binding.resolved}) {
    ${varName}_com.create()
    dom.before(${varName}, ${varName}_com.$el)
}`;
        ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n');
    }
    static updateBinding(ctx, binding) {
        const { varName } = binding;
        const code = `
if (${varName}_val !== (${varName}_val = ${binding.resolved})) {
    if (${varName}_val) {
        ${varName}_com.create()
        dom.before(${varName}, ${varName}_com.$el)
    } else {
        ${varName}_com.destroy()
    }
}`;
        ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n');
    }
    static callUpdate(ctx, parent) {
        const instance = `${ctx.varName}_com`;
        parent.appendLine(`if (/*${ctx.dataKey}*/${instance}) ${instance}.update()`);
    }
    static callDestroy(ctx, parent) {
        parent.appendLine(`${ctx.varName}_com.destroy()`);
    }
}
class ForGenerator {
    static generateCreateFunction = (ctx, nodes, mountPoint) => {
        ctx.indent += 1;
        nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint));
        ctx.appendLine(`return e0`);
        ctx.indent -= 1;
        const code = `var create = () => {
    destroyed = false`;
        ctx.prependCode(ctx.indentLines(code, ctx.indent) + '\n');
        ctx.appendLine('}');
    };
    static generateBlockMaker(ctx, varName, dataKey, newEnv, $nodes) {
        const forCtx = new ForContext(varName, dataKey, newEnv);
        forCtx.parentCtx = ctx;
        ForGenerator.generateCreateFunction(forCtx, $nodes, 'e0');
        generateUpdateFunction(forCtx);
        generateDestroyFunction(forCtx);
        generateReturn(forCtx);
        forCtx.prependLine(`var e0 = dom.fragment()`);
        forCtx.prependLine(`var destroyed = false`);
        forCtx.prependLine(`var ${forCtx.allVars.join(',')}`);
        forCtx.indent -= 1;
        forCtx.prependLine(`var ${forCtx.makeFuncName} = ({ ${forCtx.envNames} }) => {`);
        forCtx.appendLine(`}`);
        forCtx.rootCtx._childBlockMakerCodes.push(forCtx.code);
        return forCtx;
    }
    static callCreate(ctx, forCtx, mountPoint, varName, dataKey) {
        const binding = new ForBinding(ctx, forCtx, varName, dataKey);
        ctx.addBinding(binding);
        const fnName = forCtx.makeFuncName;
        const args = `${ctx.envNames}, ${forCtx.envName}: item`;
        const code = `
${varName} = dom.append(${mountPoint}, dom.comment('bl-for:${dataKey}'))
${varName}_blocks = []
${varName}_val = ${binding.resolved} ?? []
${varName}_val.forEach((item, i) => {
    var instance = ${fnName}({ ${args} })
    ${varName}_blocks.push(instance)
    instance.create()
    dom.before(${varName}, instance.$el)
})
`;
        ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n');
    }
    static updateBinding(ctx, binding) {
        const { varName } = binding;
        const fnName = binding.forCtx.makeFuncName;
        const env = binding.forCtx.envName;
        const envList = binding.context.envNames;
        const args = `${envList}, ${env}: item`;
        const code = `
if (${varName}_val !== (${varName}_val = ${binding.resolved})) {
    var list = ${binding.resolved} ?? []
    var blocks = ${varName}_blocks
    for (var i = 0, l = Math.min(list.length, blocks.length); i < l; i += 1) blocks[i].update(list[i])
    while(blocks.length > list.length) blocks.pop().destroy()
    while(list.length > blocks.length) {
        var i = blocks.length
        var item = list[i]
        var instance = ${fnName}({ ${args} })
        blocks.push(instance)
        instance.create()
        dom.before(${varName}, instance.$el)
    }
}`;
        ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n');
    }
    static callUpdate(ctx, parent) {
    }
    static callDestroy(ctx, parent) {
        parent.appendLine(`${ctx.varName}_blocks.forEach(block => block.destroy())`);
    }
}
class HtmlGenerator {
    static generateBlockMaker(ctx, varName, dataKey) {
        const context = new HtmlContext(varName, dataKey);
        context.parentCtx = ctx;
        const code = `
var ${context.makeFuncName} = ({ ${ctx.envNames} }) => {
    var destroyed = false
    var e0 = dom.fragment()
    var html
    var nodes = []
    var create = () => {
        destroyed = false
        html = ${ctx.envName}['${dataKey}'] ?? ''
        nodes = dom.parseHtml(html)
        nodes.forEach(node => dom.append(e0, node))
        return e0
    }
    var update = () => {
        if (destroyed) return
        if (html !== (html = ${ctx.envName}['${dataKey}'] ?? '')) {
          nodes.forEach(node => dom.detach(node))
          nodes = dom.parseHtml(html)
          nodes.forEach(node => dom.append(e0, node))
        }
        return e0
    }
    var destroy = () => {
        if (destroyed) return
        nodes.forEach(node => dom.detach(node))
        nodes = []
        html = void 0
        destroyed = true
    }
    return { create, update, destroy, get $el() { return e0 } }
}
    `;
        context.appendCode(ctx.indentLines(code, 0) + '\n');
        context.rootCtx._childBlockMakerCodes.push(context.code);
        return context;
    }
    static callCreate(context, htmlCtx, mountPoint, varName, dataKey) {
        const binding = new HtmlBinding(context, htmlCtx, varName, dataKey);
        context.addBinding(binding);
        const envList = context.envNames;
        const code = `
${varName} = dom.append(${mountPoint}, dom.comment('bl-html:${dataKey}'))
${varName}_com = ${htmlCtx.makeFuncName}({ ${envList} })
if (${binding.resolved}) {
    ${varName}_com.create()
    dom.before(${varName}, ${varName}_com.$el)
}`;
        context.appendCode(context.indentLines(code, context.indent) + '\n');
    }
    static updateBinding(ctx, binding) {
        const { varName } = binding;
        const code = `
${varName}_com.update()
dom.before(${varName}, ${varName}_com.$el)
`;
        ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n');
    }
}
class ElementGenerator {
    static callCreate(ctx, $node, isTop, mountPoint = 'e0') {
        const varName = ctx.declareElement(isTop);
        ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.element('${$node.nodeName}'))`);
        const attrs = BlNode.getAttrs($node);
        attrs.forEach(attr => {
            const parsedAttr = parseAttr($node, attr);
            switch (parsedAttr.type) {
                case 'static': {
                    const attrValue = JSON.stringify(parsedAttr.value);
                    ctx.appendLine(`dom.attr(${varName}, '${parsedAttr.name}', ${attrValue})`);
                    return;
                }
                case 'binding': {
                    const attrName = parsedAttr.name;
                    const dataKey = parsedAttr.value;
                    const isProp = parsedAttr.isProp;
                    const attrVal = ctx.declareAttr(varName, camelCase(attrName));
                    const binding = new AttrBinding(ctx, varName, dataKey, attrName, attrVal, !!isProp);
                    ctx.addBinding(binding);
                    if (isProp) {
                        ctx.appendLine(`dom.prop(${binding.varName}, '${binding.attrName}', (${attrVal} = ${binding.resolved} ?? null))`);
                    }
                    else {
                        ctx.appendLine(`${attrVal} = ${binding.resolved}`);
                        ctx.appendLine(`if (${attrVal} != null) dom.attr(${binding.varName}, '${binding.attrName}', ${attrVal})`);
                    }
                    return;
                }
                case 'event': {
                    const { name: eventType, value: dataKey, eventFlag } = parsedAttr;
                    const attrVal = ctx.declareAttr(varName, eventType);
                    const binding = new EventBinding(ctx, varName, dataKey, attrVal, eventType, eventFlag);
                    ctx.addBinding(binding);
                    ctx.appendLine(`${attrVal} = ${binding.resolved}`);
                    ctx.appendLine(`if (${attrVal}) dom.event(${binding.varName}, '${binding.eventType}', ${attrVal}, ${binding.eventFlag})`);
                    return;
                }
            }
        });
        BlNode.eachChild($node, $child => {
            recursivelyCreateByNode(ctx, $child, false, varName);
        });
    }
    static updateAttrBinding(ctx, binding) {
        const { varName, attrName, attrVal, isProp } = binding;
        if (isProp) {
            ctx.appendLine(`if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.prop(${varName}, '${attrName}', ${attrVal})`);
        }
        else {
            ctx.appendLine(`if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.attr(${varName}, '${attrName}', ${attrVal})`);
        }
    }
    static updateEventBinding(ctx, binding) {
        const { varName, eventType, eventFlag, attrVal } = binding;
        ctx.appendLine(`if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.event(${varName}, '${eventType}', ${attrVal}, ${eventFlag})`);
    }
}
class TextGenerator {
    static createFunc(ctx, text, reactive, isTop, mountPoint = 'e0') {
        if (reactive) {
            const varName = ctx.declareText(isTop);
            const dataKey = text;
            const binding = new TextBinding(ctx, varName, dataKey);
            ctx.addBinding(binding);
            ctx.appendLine(`${varName}_val = ${binding.resolved} ?? ''`);
            ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.text(${varName}_val))`);
        }
        else {
            if (isTop) {
                const varName = ctx.declareText(isTop);
                ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.text(${text}))`);
            }
            else {
                ctx.appendLine(`dom.append(${mountPoint}, dom.text(${text}))`);
            }
        }
    }
    static updateBinding(ctx, binding) {
        const { varName } = binding;
        ctx.appendLine(`if (${varName}_val !== (${varName}_val = ${binding.resolved})) ${varName}.nodeValue = ${varName}_val`);
    }
}
const recursivelyCreateByNode = (ctx, $node, isTop, mountPoint = 'e0') => {
    if (BlNode.isElem($node)) {
        switch ($node.nodeName) {
            case 'IF': {
                const dataKey = BlNode.getAttr($node, 'if');
                if (dataKey == null) {
                    return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint);
                }
                const varName = ctx.declareIf(isTop);
                const context = IfGenerator.generateBlockMaker(ctx, varName, dataKey, BlNode.children($node));
                return IfGenerator.callCreate(ctx, context, mountPoint, varName, dataKey);
            }
            case 'FOR': {
                if (BlNode.hasAttr($node, 'each')) {
                    const expr = BlNode.getAttr($node, 'each') ?? '';
                    const [, g1, g2] = expr.match(/\s*([\S\s]+)+\s+as\s+([_$a-z][_$a-z0-9]*)$/i) ?? ['', ''];
                    const newEnv = camelCase(g2);
                    const dataKey = g1;
                    if (!newEnv || !dataKey) {
                        return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint);
                    }
                    const varName = ctx.declareFor(isTop);
                    const context = ForGenerator.generateBlockMaker(ctx, varName, dataKey, newEnv, BlNode.children($node));
                    return ForGenerator.callCreate(ctx, context, mountPoint, varName, dataKey);
                }
            }
            case 'T': {
                if (BlNode.hasAttr($node, 'text')) {
                    const dataKey = BlNode.getAttr($node, 'text') ?? '';
                    return TextGenerator.createFunc(ctx, dataKey, true, isTop, mountPoint);
                }
            }
            case 'RICH': {
                if (BlNode.hasAttr($node, 'html')) {
                    const dataKey = BlNode.getAttr($node, 'html');
                    if (!dataKey) {
                        return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint);
                    }
                    const varName = ctx.declareHtml(isTop);
                    const context = HtmlGenerator.generateBlockMaker(ctx, varName, dataKey);
                    return HtmlGenerator.callCreate(ctx, context, mountPoint, varName, dataKey);
                }
            }
            case 'TEMPLATE':
                return;
            default:
                ElementGenerator.callCreate(ctx, $node, isTop, mountPoint);
        }
    }
    else if (BlNode.isText($node)) {
        const text = JSON.stringify($node.nodeValue ?? '');
        TextGenerator.createFunc(ctx, text, false, isTop, mountPoint);
    }
};
const generateReturn = (ctx) => {
    ctx.appendLine(`return { create, update, destroy, get $el() { return e0 }, get destroyed() { return destroyed } }`);
};
const generateCreateFunction = (ctx, nodes, mountPoint) => {
    ctx.indent += 1;
    nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint));
    ctx.appendLine(`return e0`);
    ctx.indent -= 1;
    ctx.prependLine('    destroyed = false');
    ctx.prependLine('var create = () => {');
    ctx.appendLine('}');
};
function generateUpdateChildrenFunction(ctx) {
    ctx._childrenCtx.forEach(nest => {
        if (nest.type === 1) {
            IfGenerator.callUpdate(nest, ctx);
        }
        if (nest.type === 2) {
            ForGenerator.callUpdate(nest, ctx);
        }
    });
}
function generateUpdateBidingFunction(ctx) {
    ctx._binding.forEach(item => {
        switch (item.type) {
            case 0: {
                ElementGenerator.updateAttrBinding(ctx, item);
                break;
            }
            case 1: {
                TextGenerator.updateBinding(ctx, item);
                break;
            }
            case 4: {
                ForGenerator.updateBinding(ctx, item);
                break;
            }
            case 3: {
                IfGenerator.updateBinding(ctx, item);
                break;
            }
            case 2: {
                ElementGenerator.updateEventBinding(ctx, item);
                break;
            }
            case 5: {
                HtmlGenerator.updateBinding(ctx, item);
                break;
            }
        }
    });
}
const generateUpdateFunction = (ctx) => {
    if (ctx.type === 2) {
        ctx.blockStart(`var update = (itemEnv) => {`);
        ctx.appendLine(`${ctx.envName} = itemEnv`);
    }
    else {
        ctx.blockStart(`var update = () => {`);
        ctx.appendLine(`if (destroyed) return`);
    }
    generateUpdateBidingFunction(ctx);
    generateUpdateChildrenFunction(ctx);
    ctx.appendLine('return e0');
    ctx.blockEnd('}');
};
function generateDestroyEventsFunction(ctx) {
    ctx._binding
        .filter(item => item.type === 2)
        .forEach(binding => {
        const { varName, eventType, eventFlag } = binding;
        ctx.appendLine(`dom.event(${varName}, '${eventType}', null, ${eventFlag})`);
    });
}
const generateDestroyFunction = (ctx) => {
    ctx.blockStart(`var destroy = () => {`);
    ctx.appendLine(`if (destroyed) return`);
    generateDestroyEventsFunction(ctx);
    ctx.topLevelVars.forEach(varName => {
        if (varName.startsWith('if')) {
            ctx.appendLine(`${varName}_com.destroy()`);
        }
        else if (varName.startsWith('html')) {
            ctx.appendLine(`${varName}_com.destroy()`);
        }
        else if (varName.startsWith('for')) {
            ctx.appendLine(`${varName}_blocks.forEach(block => block.destroy())`);
        }
        ctx.appendLine(`dom.detach(${varName})`);
    });
    ctx.appendLine(`${ctx.allVars.join(' = ')} = void 0`);
    ctx.appendLine(`destroyed = true`);
    ctx.blockEnd(`}`);
};
export function compile(root) {
    console.time('CIMPILE');
    const rootCtx = RootGenerator.generateRootBlockMaker([root]);
    const result = rootCtx.compile();
    console.timeEnd('CIMPILE');
    return Object.assign(result, {
        code: `function a({ dom }) {\n${rootCtx.code}}`,
    });
}
function parseAttr($node, attr) {
    const value = attr.value ?? '';
    let type = 'static';
    let name = attr.name;
    let eventFlag;
    let isProp = false;
    if (!!value) {
        if (name.startsWith('bl:')) {
            type = 'binding';
            name = name.slice(3);
        }
        else if (name.startsWith('bl-prop:')) {
            type = 'binding';
            name = name.slice(8);
            isProp = true;
            if (name.endsWith('.camel')) {
                name = camelCase(name.slice(0, -6));
            }
        }
        else if (name.startsWith('bl-on:')) {
            type = 'event';
            name = name.slice(6);
            const flagString = name.split('.').slice(1);
            eventFlag = BlNode.makeEventFlag(flagString);
            name = name.split('.')[0];
            if (flagString.includes('camel')) {
                name = camelCase(name);
            }
        }
        else if ($node.nodeName === 'BL-FOR' && name.startsWith('each:')) {
            type = 'for';
            name = name.slice(5);
            if (name.endsWith('.camel')) {
                name = camelCase(name.slice(0, -6));
            }
        }
    }
    return { type, isProp, name, value, eventFlag };
}
function camelCase(str) {
    str = ('' + str).trim();
    if (!str.length)
        return str;
    return str
        .replace(/[-_]+([\S])/g, (_, char) => char.toUpperCase())
        .replace(/^([A-Z])/, (_, char) => char.toLowerCase());
}
