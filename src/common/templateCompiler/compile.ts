import * as BlNode from './node.js'
import { IfBinding, ForBinding, HtmlBinding, AttrBinding, EventBinding, TextBinding, BindingType } from './Binding.js'
import { Context, IfContext, ForContext, HtmlContext, RootContext, ContextType } from './Context.js'

const enum BlockStatus {
  BeforeInit = 0,
  Created,
  Destroyed,
}

type UpdateFn = (updateData: object) => void

type CreateFn = () => UpdateFn

type Compiled = { create: CreateFn; update: UpdateFn; $el: any }

class RootGenerator {
  static generateRootBlockMaker($nodes: BlNode.BlNode[]) {
    const rootCtx = new RootContext()
    generateCreateFunction(rootCtx, $nodes, 'e0')
    generateUpdateFunction(rootCtx)
    generateDestroyFunction(rootCtx)

    const code = `var set = (data = {}) => {
    Object.assign(__bl_env_root, data)
    update()
    return e0
}`
    rootCtx.appendCode(rootCtx.indentLines(code, rootCtx.indent) + '\n')
    rootCtx.appendLine(
      `return { set, create, update, destroy, get $el() { return e0 }, get destroyed() { return destroyed } }`
    )

    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码

    rootCtx.prependLine(`var destroyed = false`)
    rootCtx.prependLine(`var ${rootCtx.allVars.join(',')}`)

    if (rootCtx._binding.length) {
      const code = `
var __bl_env_root = data || Object.create(null)
var dirty_keys = new Map()`
      rootCtx.prependCode(rootCtx.indentLines(code, rootCtx.indent) + '\n')
    }

    rootCtx.prependLine(`var e0 = dom.fragment()`)
    rootCtx.prependLine('\n/* root start: */')

    // 在顶部插入遍历过程收集到的所有的子孙 block 的 “生成函数”
    rootCtx.prependCode(rootCtx._childBlockMakerCodes.join(''))
    return rootCtx
  }
}

class IfGenerator {
  // if_block 的构造函数（收集到 rootCtx，最后一并生成到最外层顶部）
  static generateBlockMaker(ctx: Context, varName: string, dataKey: string, $nodes: BlNode.BlNode[]) {
    const ifCtx = new IfContext(varName, dataKey)
    ifCtx.parentCtx = ctx

    // if 块生成的时候，初始状态可能为 false，此时不调用 create 进行初始化
    // 后续 if 块 update 的时候就会出错，因此实例化后，默认标记为 destroyed，
    // 在调用 create 函数后，再转换成非 destroyed
    ifCtx.appendLine(`var flag = ${BlockStatus.BeforeInit}`)
    ifCtx.appendLine(`var e0 = dom.fragment()`)

    // create 函数生成
    // generateCreateFunction(ifCtx, $nodes, 'e0')
    ifCtx.blockStart('var create = () => {')
    ifCtx.appendLine(`flag = ${BlockStatus.Created}`)
    $nodes.forEach(node => recursivelyCreateByNode(ifCtx, node, true, 'e0'))
    ifCtx.appendLine(`return e0`)
    ifCtx.blockEnd('}')

    // update 函数生成
    // generateUpdateFunction(ifCtx)
    // 如果当前 context 下没有任何动态内容，返回空白函数即可
    ifCtx.blockStart(`var update = () => {`)
    ifCtx.appendLine(`if (flag !== ${BlockStatus.Created}) return`)
    generateUpdateBidingFunction(ifCtx)
    generateUpdateChildrenFunction(ifCtx)
    ifCtx.appendLine('return e0')
    ifCtx.blockEnd('}')

    // destroy 函数生成
    ifCtx.blockStart(`var destroy = () => {`)
    ifCtx.appendLine(`if (flag !== ${BlockStatus.Created}) return`)
    generateDestroyEventsFunction(ifCtx)
    // 从 DOM 中移除该 context 下的顶层的节点
    ifCtx.topLevelVars.forEach(varName => {
      if (varName.startsWith('if')) {
        ifCtx.appendLine(`${varName}_com.destroy()`)
      } else if (varName.startsWith('html')) {
        ifCtx.appendLine(`${varName}_com.destroy()`)
      } else if (varName.startsWith('for')) {
        ifCtx.appendLine(`${varName}_blocks.forEach(block => block.destroy())`)
      }
      ifCtx.appendLine(`dom.detach(${varName})`)
    })
    // 所有变量设置为空（释放内存，并且 update 逻辑会检测，避免无意义更新）
    ifCtx.appendLine(`${ifCtx.allVars.join(' = ')} = void 0`)
    ifCtx.appendLine(`flag = ${BlockStatus.Destroyed}`)
    ifCtx.blockEnd(`}`)

    generateReturn(ifCtx)

    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码
    ifCtx.prependLine(`var ${ifCtx.allVars.join(',')}`)

    // 生成函数包裹
    ifCtx.indent -= 1
    ifCtx.prependLine(`var ${ifCtx.makeFuncName} = ({ ${ifCtx.envNames} }) => {`)
    ifCtx.appendLine(`}`)

    ifCtx.rootCtx._childBlockMakerCodes.push(ifCtx.code)
    return ifCtx
  }

  // if_block 实例的 create 逻辑
  static callCreate(ctx: Context, ifCtx: IfContext, mountPoint: string, varName: string, dataKey: string) {
    const binding = new IfBinding(ctx, ifCtx, varName, dataKey)
    ctx.addBinding(binding)
    // 插入一个注释结点作为插入锚点
    // 创建 if 实例
    // 判断当前 create 函数传入的初始化条件，条件成立，则调用 if 实例的 create 初始化
    const code = `
${varName} = dom.append(${mountPoint}, dom.comment('bl-if:${dataKey}'))
${varName}_com = ${ifCtx.makeFuncName}({ ${ifCtx.envNames} })
if (${varName}_val = ${binding.resolved}) {
    ${varName}_com.create()
    dom.before(${varName}, ${varName}_com.$el)
}`
    ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n')
  }

  // if 绑定需要关注 条件值（dataKey） 本身的 update，实在当前 context 下进行的，
  // 根据 条件值 切换生成插入、销毁移除
  // 而 if 内部的元素，则由 if_block update，在 if_block 的 context 中处理的
  static updateBinding(ctx: Context, binding: IfBinding) {
    const { varName } = binding
    const code = `
if (${varName}_val !== (${varName}_val = ${binding.resolved})) {
    if (${varName}_val) {
        ${varName}_com.create()
        dom.before(${varName}, ${varName}_com.$el)
    } else {
        ${varName}_com.destroy()
    }
}`
    ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n')
  }

  // if_block 实例的 update 方法调用
  static callUpdate(ctx: IfContext, parent: Context) {
    const instance = `${ctx.varName}_com`
    parent.appendLine(`if (/*${ctx.dataKey}*/${instance}) ${instance}.update()`)
  }

  // if_block 实例 destroy 方法调用
  static callDestroy(ctx: IfContext, parent: Context) {
    parent.appendLine(`${ctx.varName}_com.destroy()`)
  }
}

class ForGenerator {
  // 生成 create 函数
  static generateCreateFunction = (ctx: ForContext, nodes: BlNode.t[], mountPoint: string) => {
    // 函数体，多缩进一层，方便后面套上函数外壳
    ctx.indent += 1
    nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint))
    ctx.appendLine(`return e0`)
    ctx.indent -= 1
    const code = `var create = () => {
    destroyed = false`
    ctx.prependCode(ctx.indentLines(code, ctx.indent) + '\n')

    ctx.appendLine('}')
  }

  // 插入 for 块创建逻辑（会在当前 ctx 顶部生成对应 varName 的 for 块创建函数）
  static generateBlockMaker(ctx: Context, varName: string, dataKey: string, newEnv: string, $nodes: BlNode.BlNode[]) {
    const forCtx = new ForContext(varName, dataKey, newEnv)
    forCtx.parentCtx = ctx
    ForGenerator.generateCreateFunction(forCtx, $nodes, 'e0')
    generateUpdateFunction(forCtx)
    generateDestroyFunction(forCtx)
    generateReturn(forCtx)
    // 以下，生成一些需要完整遍历当前 context 子树，才能收集完整信息进行生成的代码

    forCtx.prependLine(`var e0 = dom.fragment()`)
    forCtx.prependLine(`var destroyed = false`)
    forCtx.prependLine(`var ${forCtx.allVars.join(',')}`)

    forCtx.indent -= 1
    forCtx.prependLine(`var ${forCtx.makeFuncName} = ({ ${forCtx.envNames} }) => {`)
    forCtx.appendLine(`}`)

    forCtx.rootCtx._childBlockMakerCodes.push(forCtx.code)
    return forCtx
  }

  // for_block 实例的 create 函数
  static callCreate(ctx: Context, forCtx: ForContext, mountPoint: string, varName: string, dataKey: string) {
    const binding = new ForBinding(ctx, forCtx, varName, dataKey)
    ctx.addBinding(binding)
    // ctx.allVars.push(`${varName}_val`)
    // ctx.allVars.push(`${varName}_blocks`)
    // 插入一个注释结点作为插入锚点
    // 创建 each item 实例数组
    // 初始化创建，如果条件成立，则调用 if 实例的 create 初始化
    const fnName = forCtx.makeFuncName
    const args = `${ctx.envNames}, ${forCtx.envName}: item`
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
`
    ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n')
  }

  // for_block 实例绑定，在 for_block 的 context 中 update
  static updateBinding(ctx: Context, binding: ForBinding) {
    const { varName } = binding
    // 更新元素、数据相同数量的部分
    // 如果新数据比较少，销毁多余的元素
    // 如果新数据比较多，则插入并创建
    const fnName = binding.forCtx.makeFuncName
    const env = binding.forCtx.envName
    const envList = binding.context.envNames
    const args = `${envList}, ${env}: item`
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
}`
    ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n')
  }

  // for_block 实例的 update 方法调用
  static callUpdate(ctx: ForContext, parent: Context) {
    //
  }

  // for_block 实例的 destroy 方法调用
  static callDestroy(ctx: ForContext, parent: Context) {
    parent.appendLine(`${ctx.varName}_blocks.forEach(block => block.destroy())`)
  }
}

class HtmlGenerator {
  // if_block 的构造函数（收集到 rootCtx，最后一并生成到最外层顶部）
  static generateBlockMaker(ctx: Context, varName: string, dataKey: string) {
    const context = new HtmlContext(varName, dataKey)
    context.parentCtx = ctx
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
    `
    context.appendCode(ctx.indentLines(code, 0) + '\n')
    context.rootCtx._childBlockMakerCodes.push(context.code)
    return context
  }

  // html_block 实例的 create 逻辑
  static callCreate(context: Context, htmlCtx: HtmlContext, mountPoint: string, varName: string, dataKey: string) {
    const binding = new HtmlBinding(context, htmlCtx, varName, dataKey)
    context.addBinding(binding)
    // context.allVars.push(`${varName}_com`)
    // 插入一个注释结点作为插入锚点
    // 创建 html 实例
    // 判断当前 create 函数传入的初始化条件，条件成立，则调用 html 实例的 create 初始化
    const envList = context.envNames
    const code = `
${varName} = dom.append(${mountPoint}, dom.comment('bl-html:${dataKey}'))
${varName}_com = ${htmlCtx.makeFuncName}({ ${envList} })
if (${binding.resolved}) {
    ${varName}_com.create()
    dom.before(${varName}, ${varName}_com.$el)
}`
    context.appendCode(context.indentLines(code, context.indent) + '\n')
  }

  // html 绑定需要绑定值（dataKey）本身的 update，实在当前 context 下进行的，
  // 根据 html 内容 重新销毁、插入内容
  static updateBinding(ctx: Context, binding: HtmlBinding) {
    const { varName } = binding
    const code = `
${varName}_com.update()
dom.before(${varName}, ${varName}_com.$el)
`
    ctx.appendCode(ctx.indentLines(code, ctx.indent) + '\n')
  }
}

// 其他标签处理
class ElementGenerator {
  // element 结点的 create 过程
  static callCreate(ctx: Context, $node: BlNode.ElementNode | Element, isTop: boolean, mountPoint = 'e0') {
    // 声明一个变量引用元素
    const varName = ctx.declareElement(isTop)
    ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.element('${$node.nodeName}'))`)

    const attrs = BlNode.getAttrs($node)
    // parseAttr(attr)
    // 处理 attributes
    attrs.forEach(attr => {
      const parsedAttr = parseAttr($node, attr)
      switch (parsedAttr.type) {
        case 'static': {
          const attrValue = JSON.stringify(parsedAttr.value)
          ctx.appendLine(`dom.attr(${varName}, '${parsedAttr.name}', ${attrValue})`)
          return
        }
        case 'binding': {
          const attrName = parsedAttr.name
          const dataKey = parsedAttr.value!
          const isProp = parsedAttr.isProp
          const attrVal = ctx.declareAttr(varName, camelCase(attrName))
          const binding = new AttrBinding(ctx, varName, dataKey, attrName, attrVal, !!isProp)
          ctx.addBinding(binding)

          if (isProp) {
            // eg. <div bl:prop-name.prop="dataKey"> -> div['prop-name'] = data['dataKey']
            // eg. <div bl:prop-name.prop.camel="dataKey"> -> div.propName = data['dataKey']
            ctx.appendLine(
              `dom.prop(${binding.varName}, '${binding.attrName}', (${attrVal} = ${binding.resolved} ?? null))`
            )
          } else {
            // eg. <div bl:prop-name="dataKey"> -> div.setAttribute('prop-name', data['dataKey'])
            ctx.appendLine(`${attrVal} = ${binding.resolved}`)
            ctx.appendLine(`if (${attrVal} != null) dom.attr(${binding.varName}, '${binding.attrName}', ${attrVal})`)
          }

          return
        }
        case 'event': {
          // <div bl-on:event-name="callbackName"> -> div.addEventListener('event-name', data['callbackName'])
          // <div bl-on:event-name.camel="callbackName"> -> div.addEventListener('eventName', data['callbackName'])
          const { name: eventType, value: dataKey, eventFlag } = parsedAttr
          const attrVal = ctx.declareAttr(varName, eventType)
          const binding = new EventBinding(ctx, varName, dataKey, attrVal, eventType, eventFlag!)
          ctx.addBinding(binding)
          ctx.appendLine(`${attrVal} = ${binding.resolved}`)
          ctx.appendLine(
            `if (${attrVal}) dom.event(${binding.varName}, '${binding.eventType}', ${attrVal}, ${binding.eventFlag})`
          )
          return
        }
      }
    })

    // 递归处理子节点
    BlNode.eachChild($node, $child => {
      recursivelyCreateByNode(ctx, $child, false, varName)
    })
  }

  // element 结点的 attr/prop 绑定 update 逻辑
  static updateAttrBinding(ctx: Context, binding: AttrBinding) {
    const { varName, attrName, attrVal, isProp } = binding
    if (isProp) {
      ctx.appendLine(
        `if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.prop(${varName}, '${attrName}', ${attrVal})`
      )
    } else {
      ctx.appendLine(
        `if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.attr(${varName}, '${attrName}', ${attrVal})`
      )
    }
  }

  // element 结点的 event 绑定 update 逻辑
  static updateEventBinding(ctx: Context, binding: EventBinding) {
    const { varName, eventType, eventFlag, attrVal } = binding
    ctx.appendLine(
      `if (${attrVal} !== (${attrVal} = ${binding.resolved})) dom.event(${varName}, '${eventType}', ${attrVal}, ${eventFlag})`
    )
  }
}

// 处理文本
class TextGenerator {
  // text 结点的 create 过程
  static createFunc(ctx: Context, $node: BlNode.TextNode | Text, isTop: boolean, mountPoint = 'e0') {
    // 文本中可能有插值，解析成不同的片段，分别生成 TextNode
    BlNode.parseText($node.nodeValue ?? '').forEach(record => {
      switch (record.type) {
        case 'static': {
          const text = JSON.stringify(record.textContent)
          if (isTop) {
            const varName = ctx.declareText(isTop)
            ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.text(${text}))`)
          } else {
            // 非顶层，无需取名
            ctx.appendLine(`dom.append(${mountPoint}, dom.text(${text}))`)
          }
          break
        }
        case 'reactive': {
          const varName = ctx.declareText(isTop)
          const dataKey = record.propName
          const binding = new TextBinding(ctx, varName, dataKey)
          ctx.addBinding(binding)
          ctx.appendLine(`${varName}_val = ${binding.resolved} ?? ''`)
          ctx.appendLine(`${varName} = dom.append(${mountPoint}, dom.text(${varName}_val))`)
          break
        }
      }
    })
  }

  static updateBinding(ctx: Context, binding: TextBinding) {
    const { varName } = binding
    ctx.appendLine(
      `if (${varName}_val !== (${varName}_val = ${binding.resolved})) ${varName}.nodeValue = ${varName}_val`
    )
  }
}

// 根据结点，递归生成创建代码
const recursivelyCreateByNode = (ctx: Context, $node: BlNode.t, isTop: boolean, mountPoint = 'e0') => {
  if (BlNode.isElem($node)) {
    switch ($node.nodeName) {
      // <bl-if cond="boolValue">...</bl-if>
      case 'BL-IF': {
        const dataKey = BlNode.getAttr($node, 'cond')
        if (dataKey == null) {
          return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint)
        }
        const varName = ctx.declareIf(isTop)
        const context = IfGenerator.generateBlockMaker(ctx, varName, dataKey, BlNode.children($node))
        return IfGenerator.callCreate(ctx, context, mountPoint, varName, dataKey)
      }
      case 'BL-FOR': {
        // <bl-for each:item-name="list">{itemName.someText}</bl-for>
        // <bl-for each:item-name="list" index="index">{index.value} - {itemName.someText}</bl-for>
        const attr = BlNode.getAttrs($node).find(attr => attr.name.startsWith('each:'))
        const newEnv = camelCase(attr?.name?.slice(5) ?? '')
        const dataKey = attr?.value

        if (!newEnv || !dataKey) {
          return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint)
        }
        const varName = ctx.declareFor(isTop)
        const context = ForGenerator.generateBlockMaker(ctx, varName, dataKey, newEnv, BlNode.children($node))
        return ForGenerator.callCreate(ctx, context, mountPoint, varName, dataKey)
      }
      case 'BL-HTML': {
        const dataKey = BlNode.getAttr($node, 'content')
        if (!dataKey) {
          return ElementGenerator.callCreate(ctx, $node, isTop, mountPoint)
        }
        const varName = ctx.declareHtml(isTop)
        const context = HtmlGenerator.generateBlockMaker(ctx, varName, dataKey)
        return HtmlGenerator.callCreate(ctx, context, mountPoint, varName, dataKey)
      }
      case 'TEMPLATE':
        return
      default:
        // 其他标签处理
        ElementGenerator.callCreate(ctx, $node, isTop, mountPoint)
    }
  } else if (BlNode.isText($node)) {
    TextGenerator.createFunc(ctx, $node, isTop, mountPoint)
  }
}

const generateReturn = (ctx: Context) => {
  ctx.appendLine(`return { create, update, destroy, get $el() { return e0 }, get destroyed() { return destroyed } }`)
}

// 生成 create 函数
const generateCreateFunction = (ctx: Context, nodes: BlNode.t[], mountPoint: string) => {
  // 函数体，多缩进一层，方便后面套上函数外壳
  ctx.indent += 1
  nodes.forEach(node => recursivelyCreateByNode(ctx, node, true, mountPoint))
  ctx.appendLine(`return e0`)
  ctx.indent -= 1

  // 包裹进函数
  ctx.prependLine('    destroyed = false')
  ctx.prependLine('var create = () => {')
  ctx.appendLine('}')
}

// 如果存在子 block（if、for、html 等等），逐个子 block 调用 update 方法
function generateUpdateChildrenFunction(ctx: Context) {
  ctx._childrenCtx.forEach(nest => {
    if (nest.type === ContextType.If) {
      IfGenerator.callUpdate(nest, ctx)
    }
    if (nest.type === ContextType.For) {
      ForGenerator.callUpdate(nest, ctx)
    }
  })
}

function generateUpdateBidingFunction(ctx: Context) {
  ctx._binding.forEach(item => {
    switch (item.type) {
      case BindingType.Attr: {
        ElementGenerator.updateAttrBinding(ctx, item)
        break
      }
      case BindingType.Text: {
        TextGenerator.updateBinding(ctx, item)
        break
      }
      case BindingType.For: {
        ForGenerator.updateBinding(ctx, item)
        break
      }
      case BindingType.If: {
        IfGenerator.updateBinding(ctx, item)
        break
      }
      case BindingType.Event: {
        ElementGenerator.updateEventBinding(ctx, item)
        break
      }
      case BindingType.Html: {
        HtmlGenerator.updateBinding(ctx, item)
        break
      }
    }
  })
}

// 生成 update 函数（根据响应式属性生成更新逻辑，全静态内容，则生成空函数）
const generateUpdateFunction = (ctx: Context) => {
  if (ctx.type === ContextType.For) {
    ctx.blockStart(`var update = (itemEnv) => {`)
    ctx.appendLine(`${ctx.envName} = itemEnv`)
  } else {
    ctx.blockStart(`var update = () => {`)
    ctx.appendLine(`if (destroyed) return`)
  }
  generateUpdateBidingFunction(ctx)
  generateUpdateChildrenFunction(ctx)
  ctx.appendLine('return e0')
  ctx.blockEnd('}')
}

function generateDestroyEventsFunction(ctx: Context) {
  ctx._binding
    .filter(item => item.type === BindingType.Event)
    .forEach(binding => {
      const { varName, eventType, eventFlag } = binding as EventBinding
      ctx.appendLine(`dom.event(${varName}, '${eventType}', null, ${eventFlag})`)
    })
}

// 生成 destroy 函数
const generateDestroyFunction = (ctx: Context) => {
  ctx.blockStart(`var destroy = () => {`)
  ctx.appendLine(`if (destroyed) return`)
  generateDestroyEventsFunction(ctx)
  // 从 DOM 中移除该 context 下的顶层的节点
  ctx.topLevelVars.forEach(varName => {
    if (varName.startsWith('if')) {
      ctx.appendLine(`${varName}_com.destroy()`)
    } else if (varName.startsWith('html')) {
      ctx.appendLine(`${varName}_com.destroy()`)
    } else if (varName.startsWith('for')) {
      ctx.appendLine(`${varName}_blocks.forEach(block => block.destroy())`)
    }
    ctx.appendLine(`dom.detach(${varName})`)
  })
  // 所有变量设置为空（释放内存，并且 update 逻辑会检测，避免无意义更新）
  ctx.appendLine(`${ctx.allVars.join(' = ')} = void 0`)
  ctx.appendLine(`destroyed = true`)
  ctx.blockEnd(`}`)
}

export function compile(root: BlNode.t): (() => Compiled) & { code: string } {
  console.time('CIMPILE')
  const rootCtx = RootGenerator.generateRootBlockMaker([root])

  const result = rootCtx.compile()

  console.timeEnd('CIMPILE')

  return Object.assign(result, {
    code: `function a({ dom }) {\n${rootCtx.code}}`,
  }) as any
  // return result
}

function parseAttr($node: BlNode.ElementNode | Element, attr: BlNode.ElemAttr): BlNode.ParsedAttr {
  const value = attr.value ?? ''
  let type: BlNode.AttrType = 'static'
  let name = attr.name
  let eventFlag!: number
  let isProp = false

  if (!!value) {
    if (name.startsWith('bl:')) {
      type = 'binding'
      name = name.slice(3)
    } else if (name.startsWith('bl-prop:')) {
      type = 'binding'
      name = name.slice(8)
      isProp = true
      if (name.endsWith('.camel')) {
        name = camelCase(name.slice(0, -6))
      }
    } else if (name.startsWith('bl-on:')) {
      type = 'event'
      name = name.slice(6)
      const flagString = name.split('.').slice(1)
      eventFlag = BlNode.makeEventFlag(flagString)
      name = name.split('.')[0]
      if (flagString.includes('camel')) {
        name = camelCase(name)
      }
    } else if ($node.nodeName === 'BL-FOR' && name.startsWith('each:')) {
      type = 'for'
      name = name.slice(5)
      if (name.endsWith('.camel')) {
        name = camelCase(name.slice(0, -6))
      }
    }
  }
  return { type, isProp, name, value, eventFlag }
}

function camelCase(str: string): string {
  str = ('' + str).trim()
  if (!str.length) return str
  return str
    .replace(/[-_]+([\S])/g, (_, char) => char.toUpperCase())
    .replace(/^([A-Z])/, (_, char) => char.toLowerCase())
}
