import type { Binding } from './Binding.js'
import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX, ATTR_PREFIX } from './constants.js'
import { EnvRecord } from './EnvRecord.js'
import { Code } from './Code.js'

export const enum ContextType {
  Root,
  If,
  For,
  Html,
}

export class ContextBase {
  type!: ContextType

  codeMaker = new Code()

  // 记录绑定数量，用于生成变量生成、销毁
  _elementCount = 0
  _textCount = 0
  _ifCount = 0
  _forCount = 0
  _htmlCount = 0
  _attrCount = 0

  // 记录根节点，用于生成销毁代码
  _topElements: number[] = []
  _topTexts: number[] = []
  _topIfs: number[] = []
  _topFors: number[] = []
  _topHtmls: number[] = []

  // 当前 context 自身的数据绑定
  _ownBindings: Binding[] = []
  // 当前 context 自身的自由绑定，即非当前 env 的数据绑定（list item 内部，引用了外层 env 的数据）
  _ownFreeBindings: Binding[] = []
  // 当前 context 自身依赖的所有环境的名称（即真正依赖了该环境的数据，是能访问的所有环境的一个子集）
  _ownDepEnvNames: string[] = []

  // 当前 context 能访问的所有 env（作为参数传入，所以可以访问，但是不一定有依赖上面的数据）
  _envs: EnvRecord[] = []

  // 根 context（Node Tree 的顶层 context）
  _rootCtx: RootContext = this as unknown as RootContext
  // 父 context（父 Node Tree 的 context）
  _parentCtx: Context = this as unknown as Context
  // 子孙 context 数组（子级 Node Tree 的 context，如 <if>，<for>，<rich>等等 Node，均会创建自身的 context）
  _childrenCtx: Context[] = []

  // 当前 context 中，所有顶层的结点，
  // 销毁时，只需要移除树的顶层 DOM 结点即可
  topLevelVars: string[] = []

  // 检查是否不存在响应式绑定
  get isStatic(): boolean {
    return !this._ownBindings.length && this._childrenCtx.every(ctx => ctx.isStatic)
  }

  // 是否包含自由绑定（含子 block 的）
  _hasFreeBinding?: boolean
  get hasFreeBinding(): boolean {
    if (this._hasFreeBinding != null) return this._hasFreeBinding
    const result = !!this._ownFreeBindings.length || this._childrenCtx.some(ctx => ctx.hasFreeBinding)
    return (this._hasFreeBinding = result)
  }

  // 所有的自由绑定（含子 block 的）
  get allFreeBindings(): Binding[] {
    return this._childrenCtx.reduce((acc, ctx) => {
      return acc.concat(ctx.allFreeBindings)
    }, this._ownFreeBindings)
  }

  get parentCtx() {
    return this._parentCtx
  }
  set parentCtx(ctx: Context) {
    this._parentCtx = ctx
    if (ctx !== (this as unknown as Context)) {
      ctx._childrenCtx.push(this as unknown as Context)
    }
  }

  get rootCtx(): RootContext {
    let ctx = this._parentCtx
    while (ctx._parentCtx !== ctx) ctx = ctx._parentCtx
    return ctx as RootContext
  }

  get closestEnvCtx(): RootContext | ForContext {
    const type = (this as unknown as RootContext | ForContext).type
    if (type === ContextType.Root || ContextType.For) {
      return this as unknown as RootContext | ForContext
    }
    return this.parentCtx.closestEnvCtx
  }

  get env(): EnvRecord {
    return this.envs[this._envs.length - 1]
  }

  get envName(): string {
    return this.env.name
  }

  get envs(): EnvRecord[] {
    return this._envs
  }

  get envNames(): string {
    return this.envs.map(item => item.name).join(',')
  }

  getCode() {
    return this.codeMaker.code
  }

  declareIf(isTop = false) {
    const index = ++this._ifCount
    const name = IF_PREFIX + index
    if (isTop) {
      this._topIfs.push(index)
      this.topLevelVars.push(name)
    }
    return name
  }

  declareFor(isTop = false) {
    const index = ++this._forCount
    const name = FOR_PREFIX + index
    if (isTop) {
      this._topFors.push(index)
      this.topLevelVars.push(name)
    }
    return name
  }

  declareHtml(isTop = false) {
    const index = ++this._htmlCount
    const name = HTML_PREFIX + index
    if (isTop) {
      this._topHtmls.push(index)
      this.topLevelVars.push(name)
    }
    return name
  }

  declareElement(isTop = false) {
    const index = ++this._elementCount
    const name = ELEMENT_PREFIX + index
    if (isTop) {
      this._topElements.push(index)
      this.topLevelVars.push(name)
    }
    return name
  }

  declareText(isTop = false) {
    const index = ++this._textCount
    const name = TEXT_PREFIX + index
    if (isTop) {
      this._topTexts.push(index)
      this.topLevelVars.push(name)
    }
    return name
  }

  declareAttr(/*elName: string, attrName: string*/) {
    const name = ATTR_PREFIX + ++this._attrCount
    return name
  }

  getAllVars(sep: string) {
    let output = ''
    for (let i = 1; i <= this._elementCount; i += 1) {
      const name = ELEMENT_PREFIX + i
      output += (output ? sep : '') + name
    }
    for (let i = 1; i <= this._textCount; i += 1) {
      const name = TEXT_PREFIX + i
      output += (output ? sep : '') + name + sep + name + '_val'
    }
    for (let i = 1; i <= this._ifCount; i += 1) {
      const name = IF_PREFIX + i
      output += (output ? sep : '') + name + sep + name + '_com' + sep + name + '_val'
    }
    for (let i = 1; i <= this._forCount; i += 1) {
      const name = FOR_PREFIX + i
      output += (output ? sep : '') + name + sep + name + '_blocks' + sep + name + '_val'
    }
    for (let i = 1; i <= this._htmlCount; i += 1) {
      const name = HTML_PREFIX + i
      output += (output ? sep : '') + name + sep + name + '_com' + sep + name + '_val'
    }
    for (let i = 1; i <= this._attrCount; i += 1) {
      const name = ATTR_PREFIX + i
      output += (output ? sep : '') + name
    }
    return output
  }

  addBinding(binding: Binding) {
    this._ownBindings.push(binding)

    if (this._ownDepEnvNames.indexOf(binding.envName) === -1) {
      this._ownDepEnvNames.push(binding.envName)
    }

    if (binding.envName !== this.envName) {
      this._ownFreeBindings.push(binding)
    }
  }
}

export class RootContext extends ContextBase {
  override readonly type = ContextType.Root as const

  _childBlockMakerCodes: string[] = []

  constructor() {
    super()
    this._envs = [EnvRecord.root()]
    this.codeMaker._indent = 1
  }
}

export class IfContext extends ContextBase {
  static uid = 0

  override readonly type = ContextType.If as const

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string, parentCtx: Context) {
    super()
    this.makeFuncName = `make_if_${++IfContext.uid}/*${dataKey}*/`
    this.varName = varName
    this.dataKey = dataKey
    this.parentCtx = parentCtx
    this.codeMaker._indent = 1
    this._envs = parentCtx.envs
  }
}

// 移除 indexEnv 支持，因为解析运行时开销原因，不支持表达式，不支持表达式直接传入 index 并没什么意义
export class ForContext extends ContextBase {
  static uid = 0

  override readonly type = ContextType.For as const

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string, newEnv: string, parentCtx: Context) {
    super()
    this.makeFuncName = `make_for_${++ForContext.uid}/*${dataKey}*/`
    this.varName = varName
    this.dataKey = dataKey
    this.parentCtx = parentCtx
    this.codeMaker._indent = 1
    this._envs = parentCtx.envs.concat(EnvRecord.for(newEnv))
  }
}

export class HtmlContext extends ContextBase {
  static uid = 0

  override readonly type = ContextType.Html as const

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string, parentCtx: Context) {
    super()
    this.makeFuncName = `make_html_${++HtmlContext.uid}/*${dataKey}*/`
    this.varName = varName
    this.dataKey = dataKey
    this.parentCtx = parentCtx
    this.codeMaker._indent = 1
    this._envs = parentCtx.envs
  }
}

export type Context = RootContext | IfContext | ForContext | HtmlContext
