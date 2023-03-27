import * as BlNode from './node.js'
import { IfBinding, ForBinding, HtmlBinding, AttrBinding, EventBinding, TextBinding, BindingType } from './Binding.js'
import { Context, IfContext, ForContext, HtmlContext, RootContext, ContextType } from './Context.js'
import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX } from './constants.js'
import { Code } from './Code.js'

let bindAttrKeyword = 'bl-attr'
let bindPropKeyword = 'bl-prop'
let bindEventKeyword = 'bl-on'
let bindingRecordSeperator = ','
let bindingKeySeperator = '<-'
let bindingFlagSeperator = '.'

export function setup(options: any = {}) {
  if (options.bindAttrKeyword) bindAttrKeyword = options.bindAttrKeyword
  if (options.bindPropKeyword) bindPropKeyword = options.bindPropKeyword
  if (options.bindEventKeyword) bindEventKeyword = options.bindEventKeyword
  if (options.bindingRecordSeperator) bindingRecordSeperator = options.bindingRecordSeperator
  if (options.bindingKeySeperator) bindingKeySeperator = options.bindingKeySeperator
  if (options.bindingFlagSeperator) bindingFlagSeperator = options.bindingFlagSeperator
}

export type AttrType = 'binding' | 'event' | 'static' | 'for'

export type ParsedAttr = {
  type: AttrType
  name: string
  value: string
  isProp?: boolean
  itemEnvName?: string
  eventFlag?: number
}

const enum BlTag {
  If = 'IF',
  For = 'FOR',
  Rich = 'RICH',
  Text = 'T',
}

const enum BlockStatus {
  BeforeInit = 0,
  Created,
  Destroyed,
}

class RootGenerator {
  static emitConstructor($nodes: BlNode.BlNode[]) {
    const rootCtx = new RootContext()
    const codeMaker = rootCtx.codeMaker

    codeMaker
      .appendLine(`var alive=${BlockStatus.BeforeInit}`)
      .appendLine(`var e0=dom.fragment()`)
      .appendLine(`var envs={${rootCtx.envName}:model??new BlModel({})}`)
      .appendLine('var ev=new BlEvent()')
    generateCreateFunction(rootCtx, $nodes, 'e0')
    generateUpdateFunction(rootCtx)
    generateDestroyFunction(rootCtx)
    generateSetModelFunction(rootCtx)
    generateReturn(rootCtx)

    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码
    codeMaker.prependLine(`var ${rootCtx.getAllVars(',')}`)
    codeMaker.indent -= 1
    codeMaker.prependLine(`function make_root(){`).appendLine(`}`)

    return rootCtx
  }
}

class IfGenerator {
  // if_block 的构造函数（收集到 rootCtx，最后一并生成到最外层顶部）
  static emitConstructor(ifCtx: IfContext, $nodes: BlNode.BlNode[]) {
    const codeMaker = ifCtx.codeMaker
    codeMaker.appendLine(`var alive=${BlockStatus.BeforeInit}`).appendLine(`var e0=dom.fragment()`)
    // create 函数生成
    generateCreateFunction(ifCtx, $nodes, 'e0')
    // update 函数生成
    generateUpdateFunction(ifCtx)
    // destroy 函数生成
    generateDestroyFunction(ifCtx)
    // 生成 set 函数
    generateSetModelFunction(ifCtx)
    generateReturn(ifCtx)

    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码

    codeMaker
      .prependLine(`var ev=new BlEvent()`)
      // 生成顶部变量声明
      .prependLine(`var ${ifCtx.getAllVars(',')}`)
    // 生成函数包裹
    codeMaker.indent -= 1
    codeMaker.prependLine(`function ${ifCtx.makeFuncName}(envs){`).appendLine(`}`)

    ifCtx.rootCtx._childBlockMakerCodes.push(ifCtx.getCode())
    return this
  }

  // if_block 实例的 create 逻辑:
  // 插入一个注释结点作为插入锚点
  // 创建 if 实例
  // 判断当前 create 函数传入的初始化条件，条件成立，则调用 if 实例的 create 初始化
  static emitCreate(ctx: Context, ifCtx: IfContext, varName: string, dataKey: string, mountPoint: string) {
    const codeMaker = ctx.codeMaker
    const binding = new IfBinding(ctx, ifCtx, varName, dataKey)
    ctx.addBinding(binding)
    codeMaker
      .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('if:${dataKey}'))`)
      .appendLine(`${varName}_com=${ifCtx.makeFuncName}(envs)`)
      .blockStart(`if (${varName}_val=${binding.resolved}) {`)
      .appendLine(`dom.before(${varName}, ${varName}_com.create())`)
      .blockEnd(`}`)
    return this
  }

  // if 绑定需要关注 条件值（dataKey） 本身的 update，实在当前 context 下进行的，
  // 根据 条件值 切换生成插入、销毁移除
  // 而 if 内部的元素，则由 if_block update，在 if_block 的 context 中处理的
  static emitUpdate(ctx: Context, binding: IfBinding) {
    const { varName } = binding

    // 1. 处理 if 绑定的 cond 变化
    ctx.codeMaker
      .appendLine(`var ${varName}_rebuild=false`)
      .blockStart(`if (${varName}_val!==(${varName}_val=${binding.resolved})) {`)
      .blockStart(`if (${varName}_val) {`)
      .appendLine(`dom.before(${varName}, ${varName}_com.create())`)
      .blockEndAndStart(`} else {`)
      .appendLine(`${varName}_com.destroy()`)
      .blockEnd(`}`)
      .appendLine(`${varName}_rebuild=true`)
      .blockEnd(`}`)

    // 2. 外部 update 时，如果 if 内部不是纯静态内容，则也需要 update
    const ifCtx = binding.childCtx
    if (!ifCtx.isStatic) {
      const instance = `${ifCtx.varName}_com`
      ctx.codeMaker.appendLine(`if (!${ifCtx.varName}_rebuild) /*${ifCtx.dataKey}*/${instance}.update()`)
    }

    return this
  }
}

class ForGenerator {
  // 插入 for 块创建逻辑（会在当前 ctx 顶部生成对应 varName 的 for 块创建函数）
  static emitConstructor(forCtx: ForContext, $nodes: BlNode.BlNode[]) {
    const codeMaker = forCtx.codeMaker
    codeMaker.appendLine(`var alive=${BlockStatus.BeforeInit}`).appendLine(`var e0=dom.fragment()`)

    // 生成 create 函数
    generateCreateFunction(forCtx, $nodes, 'e0')
    // 生成 update 函数
    generateUpdateFunction(forCtx)
    // 生成 destroy 函数
    generateDestroyFunction(forCtx)
    // 生成 set 函数
    generateSetModelFunction(forCtx)
    generateReturn(forCtx)

    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码

    codeMaker
      .prependLine(`var ev=new BlEvent()`)
      // 生成顶部变量声明
      .prependLine(`var ${forCtx.getAllVars(',')}`)
    // 生成函数包裹
    codeMaker.indent -= 1
    codeMaker.prependLine(`function ${forCtx.makeFuncName}(envs){`).appendLine(`}`)

    forCtx.rootCtx._childBlockMakerCodes.push(forCtx.getCode())
    return this
  }

  // for_block 实例的 create 函数:
  // 插入一个注释节点作为锚点
  // 创建 each item 实例数组
  // 初始化创建，如果条件成立，则调用 if 实例的 create 初始化
  static emitCreate(ctx: Context, forCtx: ForContext, varName: string, dataKey: string, mountPoint: string) {
    const codeMaker = ctx.codeMaker
    const binding = new ForBinding(ctx, forCtx, varName, dataKey)
    ctx.addBinding(binding)
    const fnName = forCtx.makeFuncName
    const args = `Object.assign(Object.create(envs),{${forCtx.envName}:item})`
    codeMaker
      .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('for:${dataKey}'))`)
      .appendLine(`${varName}_val=${binding.resolved}??[]`)
      .blockStart(`${varName}_blocks=${varName}_val.map((item,i)=>{`)
      .appendLine(`var instance=${fnName}(${args})`)
      .appendLine(`dom.before(${varName},instance.create())`)
      .appendLine(`return instance`)
      .blockEnd(`})`)
    return this
  }

  // for 绑定更新（即绑定的数组数据更新了）：
  // 1. 更新元素、数据相同数量的部分 item，设置新数据，并调用 item 的 update 方法
  // 2. 如果新数据比较少，则销毁多余的 item
  // 3. 如果新数据比较多，则插入并创建新的 item
  static emitUpdate(ctx: Context, binding: ForBinding) {
    const codeMaker = ctx.codeMaker
    const { varName, forCtx } = binding

    // 1. for 绑定的 list 本身更新时，重新构建 each item
    const fnName = binding.forCtx.makeFuncName
    const args = `Object.assign(Object.create(envs),{${binding.forCtx.envName}:item})`
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
      .blockEnd(`}`)

    // 2. 外部 update 时，如果外部 env 有更新且 each item 引用了外部环境(包含自由绑定)，则 each item 也需要 update
    if (forCtx.hasFreeBinding) {
      // TODO, 检测 update 的 key path，是否会触发 block 更新
      codeMaker
        .blockStart(`if (!${forCtx.varName}_rebuild){`)
        .appendLine(`for(let i=0,l=${forCtx.varName}_blocks.length;i<l;i+=1) ${forCtx.varName}_blocks[i].update()`)
        .blockEnd(`}`)
    }
    return this
  }
}

class HtmlGenerator {
  // if_block 的构造函数（收集到 rootCtx，最后一并生成到最外层顶部）
  static emitConstructor(ctx: Context, htmlCtx: HtmlContext, dataKey: string) {
    const code = `function ${htmlCtx.makeFuncName}(envs){
    var alive=${BlockStatus.BeforeInit}
    var e0=dom.fragment()
    var html
    var nodes=[]
    var create=()=>{
        alive=${BlockStatus.Created}
        html=resolve(envs.${ctx.envName},${JSON.stringify(dataKey)})??''
        nodes=dom.parseHtml(html)
        nodes.forEach(node=>dom.append(e0,node))
        return e0
    }
    var update=()=>{
        if (alive!==${BlockStatus.Created}) return
        if (html!==(html=resolve(envs.${ctx.envName},${JSON.stringify(dataKey)})??'')){
          nodes.forEach(node=>dom.detach(node))
          nodes=dom.parseHtml(html)
          nodes.forEach(node=>dom.append(e0,node))
        }
        return e0
    }
    var destroy=()=>{
        if (alive!==${BlockStatus.Created}) return
        nodes.forEach(node=>dom.detach(node))
        nodes=[]
        html=void 0
        alive=${BlockStatus.Destroyed}
    }
    var set=(model)=>{}
    return {create,update,destroy,set}
}`
    htmlCtx.codeMaker.appendCode(ctx.codeMaker.indentLines(code, 0) + '\n')
    htmlCtx.rootCtx._childBlockMakerCodes.push(htmlCtx.getCode())
    return this
  }

  // html_block 实例的 create 逻辑:
  // 插入一个注释结点作为插入锚点
  // 创建 html 实例
  // 判断当前 create 函数传入的初始化条件，条件成立，则调用 html 实例的 create 初始化
  static emitCreate(context: Context, htmlCtx: HtmlContext, varName: string, dataKey: string, mountPoint: string) {
    const codeMaker = context.codeMaker
    const binding = new HtmlBinding(context, htmlCtx, varName, dataKey)
    context.addBinding(binding)
    codeMaker
      .appendLine(`${varName}=dom.append(${mountPoint},dom.comment('rich:${dataKey}'))`)
      .appendLine(`${varName}_com=${htmlCtx.makeFuncName}(envs)`)
      .blockStart(`if (${binding.resolved}) {`)
      .appendLine(`dom.before(${varName},${varName}_com.create())`)
      .blockEnd(`}`)
    return this
  }

  // html 绑定需要绑定值（dataKey）本身的 update，实在当前 context 下进行的，
  // 根据 html 内容 重新销毁、插入内容
  static emitUpdate(ctx: Context, binding: HtmlBinding) {
    const { varName } = binding
    ctx.codeMaker.appendLine(`dom.before(${varName},${varName}_com.update())`)
    return this
  }
}

// 其他标签处理
class ElementGenerator {
  // element 结点的 create 过程
  static emitCreate(ctx: Context, $node: BlNode.IElement | Element, isTop: boolean, mountPoint = 'e0') {
    const codeMaker = ctx.codeMaker
    // 声明一个变量引用元素
    const varName = ctx.declareElement(isTop)
    codeMaker.appendLine(`${varName}=dom.append(${mountPoint},dom.element('${$node.nodeName}'))`)

    // 处理 attributes
    const parsedAttrs = parseAttrs(BlNode.getAttrs($node))
    for (let i = 0, m = parsedAttrs.length; i < m; i += 1) {
      const parsedAttr = parsedAttrs[i]

      switch (parsedAttr.type) {
        case 'static': {
          const attrValue = JSON.stringify(parsedAttr.value)
          codeMaker.appendLine(`dom.attr(${varName},'${parsedAttr.name}',${attrValue})`)
          break
        }

        case 'binding': {
          const attrName = parsedAttr.name
          const dataKey = parsedAttr.value!
          const isProp = parsedAttr.isProp
          const attrVal = ctx.declareAttr()
          const binding = new AttrBinding(ctx, varName, dataKey, attrName, attrVal, !!isProp)
          ctx.addBinding(binding)

          if (isProp) {
            codeMaker.appendLine(`dom.prop(${binding.varName},'${binding.attrName}',(${attrVal}=${binding.resolved}))`)
          } else {
            codeMaker
              .appendLine(`${attrVal}=${binding.resolved}`)
              .appendLine(`if (${attrVal}!=null) dom.attr(${binding.varName},'${binding.attrName}',${attrVal})`)
          }

          break
        }

        case 'event': {
          const { name: eventType, value: dataKey, eventFlag } = parsedAttr
          const attrVal = ctx.declareAttr()
          const binding = new EventBinding(ctx, varName, dataKey, attrVal, eventType, eventFlag!)
          ctx.addBinding(binding)
          codeMaker
            .appendLine(`${attrVal}=${binding.resolved}`)
            .appendLine(
              `if (${attrVal}) dom.event(${binding.varName},'${binding.eventType}',${attrVal},${binding.eventFlag})`
            )
          break
        }
      }
    }

    // 递归处理子节点
    const $children = $node.childNodes
    for (let i = 0, length = $children.length; i < length; i += 1) {
      const $child = $children[i]
      // Element / Text
      if ($child.nodeType === 1 || $child.nodeType === 3) {
        recursivelyCreateByNode(ctx, $child, false, varName)
      }
    }
    return this
  }

  // element 结点的 attr/prop 绑定 update 逻辑
  static emitAttrUpdate(ctx: Context, binding: AttrBinding) {
    const codeMaker = ctx.codeMaker
    const { varName, attrName, attrVal, isProp } = binding
    if (isProp) {
      codeMaker.appendLine(
        `if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.prop(${varName},'${attrName}',${attrVal})`
      )
    } else {
      codeMaker.appendLine(
        `if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.attr(${varName},'${attrName}',${attrVal})`
      )
    }
    return this
  }

  // element 结点的 event 绑定 update 逻辑
  static emitEventUpdate(ctx: Context, binding: EventBinding) {
    const { varName, eventType, eventFlag, attrVal } = binding
    ctx.codeMaker.appendLine(
      `if (${attrVal}!==(${attrVal}=${binding.resolved})) dom.event(${varName},'${eventType}',${attrVal},${eventFlag})`
    )
    return this
  }
}

// 处理文本
class TextGenerator {
  // text 结点的 create 过程
  static emitCreate(ctx: Context, text: string, reactive: boolean, isTop: boolean, mountPoint = 'e0') {
    const codeMaker = ctx.codeMaker

    // 响应式文本
    if (reactive) {
      const varName = ctx.declareText(isTop)
      const dataKey = text
      const binding = new TextBinding(ctx, varName, dataKey)
      ctx.addBinding(binding)
      codeMaker
        .appendLine(`${varName}_val=${binding.resolved} ?? ''`)
        .appendLine(`${varName}=dom.append(${mountPoint},dom.text(${varName}_val))`)
    }

    // 普通文本
    else {
      if (isTop) {
        const varName = ctx.declareText(isTop)
        codeMaker.appendLine(`${varName}=dom.append(${mountPoint},dom.text(${text}))`)
      }
      // 非顶层结点，无需取名
      else {
        codeMaker.appendLine(`dom.append(${mountPoint},dom.text(${text}))`)
      }
    }
    return this
  }

  static emitUpdate(ctx: Context, binding: TextBinding) {
    const { varName } = binding
    ctx.codeMaker.appendLine(
      `if (${varName}_val!==(${varName}_val=${binding.resolved})) ${varName}.nodeValue=${varName}_val`
    )
    return this
  }
}

// 根据结点，递归生成创建代码
function recursivelyCreateByNode(ctx: Context, $node: BlNode.t, isTop: boolean, mountPoint = 'e0') {
  if (BlNode.isElem($node)) {
    switch ($node.nodeName) {
      case BlTag.If: {
        const dataKey = BlNode.getAttr($node, 'cond')
        if (dataKey == null) {
          ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint)
          return
        }
        const varName = ctx.declareIf(isTop)
        const ifCtx = new IfContext(varName, dataKey, ctx)
        IfGenerator.emitConstructor(ifCtx, BlNode.children($node)).emitCreate(ctx, ifCtx, varName, dataKey, mountPoint)
        return
      }

      case BlTag.For: {
        // <for each="list" as="itemName">{itemName.someText}</for>
        const dataKey = BlNode.getAttr($node, 'each')
        const newEnv = BlNode.getAttr($node, 'as')
        if (!newEnv || !dataKey) {
          ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint)
          return
        }
        const varName = ctx.declareFor(isTop)
        const forCtx = new ForContext(varName, dataKey, newEnv, ctx)
        ForGenerator.emitConstructor(forCtx, BlNode.children($node)).emitCreate(
          ctx,
          forCtx,
          varName,
          dataKey,
          mountPoint
        )
        return
      }

      case BlTag.Text: {
        if (BlNode.hasAttr($node, 'text')) {
          const dataKey = BlNode.getAttr($node, 'text') ?? ''
          TextGenerator.emitCreate(ctx, dataKey, true, isTop, mountPoint)
          return
        }
      }

      case BlTag.Rich: {
        if (BlNode.hasAttr($node, 'html')) {
          const dataKey = BlNode.getAttr($node, 'html')
          if (!dataKey) {
            ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint)
            return
          }
          const varName = ctx.declareHtml(isTop)
          const htmlCtx = new HtmlContext(varName, dataKey, ctx)
          HtmlGenerator.emitConstructor(ctx, htmlCtx, dataKey).emitCreate(ctx, htmlCtx, varName, dataKey, mountPoint)
          return
        }
      }

      case 'TEMPLATE': {
        const childNodes = ($node as HTMLTemplateElement).content.childNodes
        for (let i = 0; i < childNodes.length; i += 1) {
          recursivelyCreateByNode(ctx, childNodes[i], isTop, mountPoint)
        }
        return
      }

      // 其他标签处理
      default: {
        ElementGenerator.emitCreate(ctx, $node, isTop, mountPoint)
        return
      }
    }
  }

  if (BlNode.isText($node)) {
    const text = ($node.nodeValue ?? '').trim()
    if (!text) return
    TextGenerator.emitCreate(ctx, JSON.stringify(text), false, isTop, mountPoint)
  }
}

// 生成 create 函数
function generateCreateFunction(ctx: Context, nodes: BlNode.t[], mountPoint: string) {
  const codeMaker = ctx.codeMaker
  codeMaker.blockStart('var create=()=>{').appendLine(`alive=${BlockStatus.Created}`)
  nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint))
  if (ctx.type === ContextType.Root || ctx.type === ContextType.For) {
    ctx._ownDepEnvNames.forEach(envName => {
      codeMaker.appendLine(`if (envs.${envName} instanceof BlEvent) ev.listenTo(envs.${envName},'change',()=>update())`)
    })
  }
  codeMaker.appendLine(`return e0`).blockEnd('}')
}

// 生成 update 函数（根据响应式属性生成更新逻辑，全静态内容，则生成空函数）
function generateUpdateFunction(ctx: Context) {
  const codeMaker = ctx.codeMaker
  codeMaker.blockStart('var update=()=>{').appendLine(`if (alive!==${BlockStatus.Created}) return`)

  // binding 更新
  ctx._ownBindings.forEach(item => {
    switch (item.type) {
      case BindingType.Attr: {
        ElementGenerator.emitAttrUpdate(ctx, item)
        break
      }
      case BindingType.Text: {
        TextGenerator.emitUpdate(ctx, item)
        break
      }
      case BindingType.For: {
        ForGenerator.emitUpdate(ctx, item)
        break
      }
      case BindingType.If: {
        IfGenerator.emitUpdate(ctx, item)
        break
      }
      case BindingType.Event: {
        ElementGenerator.emitEventUpdate(ctx, item)
        break
      }
      case BindingType.Html: {
        HtmlGenerator.emitUpdate(ctx, item)
        break
      }
    }
  })

  codeMaker.blockEnd('}')
}

// 生成 destroy 函数
function generateDestroyFunction(ctx: Context) {
  const codeMaker = ctx.codeMaker
  codeMaker.blockStart('var destroy=()=>{').appendLine(`if (alive!==${BlockStatus.Created}) return`)

  // 销毁 events
  ctx._ownBindings
    .filter(item => item.type === BindingType.Event)
    .forEach(binding => {
      const { varName, eventType, eventFlag } = binding as EventBinding
      codeMaker.appendLine('dom.event(' + varName + ',' + JSON.stringify(eventType) + ',null,' + eventFlag + ')')
    })

  // 从 DOM 中移除该 context 下的顶层的节点
  let i = ctx._topFors.length
  while (i--) codeMaker.appendLine(FOR_PREFIX + ctx._topFors[i] + '_blocks.forEach(block=>block.destroy())')
  i = ctx._topIfs.length
  while (i--) codeMaker.appendLine(IF_PREFIX + ctx._topIfs[i] + '_com.destroy()')
  i = ctx._topHtmls.length
  while (i--) codeMaker.appendLine(HTML_PREFIX + ctx._topHtmls[i] + '_com.destroy()')
  i = ctx._topElements.length
  while (i--) codeMaker.appendLine('dom.detach(' + ELEMENT_PREFIX + ctx._topElements[i] + ')')
  i = ctx._topTexts.length
  while (i--) codeMaker.appendLine('dom.detach(' + TEXT_PREFIX + ctx._topTexts[i] + ')')

  // 所有变量设置为空（释放内存，并且 update 逻辑会检测，避免无意义更新）
  if (ctx.type === ContextType.Root || ctx.type === ContextType.For) codeMaker.appendLine(`ev.stopListening()`)
  codeMaker
    .appendLine(ctx.getAllVars('=') + '=void 0')
    .appendLine(`alive=${BlockStatus.Destroyed}`)
    .blockEnd('}')
}

// 生成 model 设置函数
function generateSetModelFunction(ctx: Context) {
  const codeMaker = ctx.codeMaker
  const isBase = ctx.type === ContextType.Root || ctx.type === ContextType.For
  if (isBase) {
    codeMaker.blockStart('var set=(model)=>{').appendLine(`if (envs.${ctx.envName}===model) return`)
    codeMaker
      .appendLine(`if (envs.${ctx.envName} instanceof BlEvent) ev.stopListening(envs.${ctx.envName})`)
      // model 被完整替换
      .appendLine(`envs.${ctx.envName}=model`)
      // 新 model 如果是 BlEvent，则订阅
      .appendLine(`if (model instanceof BlEvent) ev.listenTo(model,'change',()=>update())`)
      .appendLine(`update()`)
      .blockEnd(`}`)
  } else {
    codeMaker.appendLine('var set=noop')
  }
}

// 生成 block return 语句
function generateReturn(ctx: Context) {
  ctx.codeMaker.appendLine(`return {set,create,update,destroy}`)
}

function parseAttrs(attrs: BlNode.IAttributes): ParsedAttr[] {
  const output: ParsedAttr[] = []
  for (let i = 0, l = attrs.length; i < l; i += 1) {
    const attr = attrs[i]
    parseAttr(attr, output)
  }
  return output
}

function parseAttr(attr: BlNode.IAttr, output: ParsedAttr[]) {
  const value = attr.value ?? ''
  let type: AttrType = 'static'
  const name = attr.name
  let eventFlag!: number
  let isProp = false

  if (!value) {
    output.push({ type, isProp, name, value, eventFlag })
    return
  }

  if (name === bindAttrKeyword) {
    type = 'binding'
    value.split(bindingRecordSeperator).forEach(b => {
      const [name, value] = b.trim().split(bindingKeySeperator)
      output.push({ type, isProp, name, value, eventFlag })
    })
    return
  }

  if (name === bindPropKeyword) {
    type = 'binding'
    isProp = true
    value.split(bindingRecordSeperator).forEach(b => {
      const [name, value] = b.trim().split(bindingKeySeperator)
      output.push({ type, isProp, name, value, eventFlag })
    })
    return
  }

  if (name === bindEventKeyword) {
    type = 'event'
    value.split(bindingRecordSeperator).forEach(b => {
      const [_name, value] = b.trim().split(bindingKeySeperator)
      const [name, ...flagString] = _name.split(bindingFlagSeperator)
      eventFlag = makeEventFlag(flagString)
      output.push({ type, isProp, name, value, eventFlag })
    })
    return
  }

  output.push({ type, isProp, name, value, eventFlag })
}

function makeEventFlag(flags: string[]): number {
  let eventFlag = 0
  flags.forEach(flag => {
    switch (flag) {
      case 'capture':
        eventFlag |= 0b00000001
        break
      case 'prevent':
        eventFlag |= 0b00000010
        break
      case 'stop':
        eventFlag |= 0b00000100
        break
      case 'stopImmediate':
        eventFlag |= 0b00001000
        break
      case 'once':
        eventFlag |= 0b00010000
        break
      case 'passive':
        eventFlag |= 0b00100000
        break
    }
  })
  return eventFlag
}

export function generateCode(root: BlNode.t) {
  console.time('CODE_GENERATE')
  const rootCtx = RootGenerator.emitConstructor([root])
  const codeMaker = new Code()
  codeMaker
    // .appendLine(`var fid=-1`)
    .appendCode(rootCtx.getCode())
    // 声明遍历过程收集到的所有的子孙 block 的 “生成函数”
    .appendCode(rootCtx._childBlockMakerCodes.join(''))
    .appendLine(`return make_root()`)
  console.timeEnd('CODE_GENERATE')

  return {
    get code() {
      return codeMaker.code
    },
    get ctx() {
      return rootCtx
    },
  }
}
