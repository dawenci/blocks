import * as runtime from './runtime/index.js'
import type { Binding } from './Binding.js'
import { ELEMENT_PREFIX, FOR_PREFIX, HTML_PREFIX, IF_PREFIX, TEXT_PREFIX } from './constants.js'
import { EnvRecord } from './EnvRecord.js'

export const enum ContextType {
  Root,
  If,
  For,
  Html,
}

export class ContextBase {
  spaceSize = '    '

  _code = ''
  _codes: string[] = []
  _eIndex = 0
  _tIndex = 0
  _ifIndex = 0
  _forIndex = 0
  _htmlIndex = 0
  _indent = 0

  _binding: Binding[] = []
  _rootCtx: RootContext = this as unknown as RootContext
  _parentCtx: Context = this as unknown as Context
  _childrenCtx: Context[] = []
  _envs: EnvRecord[] = []

  _childBlockMakerCodes: string[] = []

  get parentCtx() {
    return this._parentCtx
  }
  set parentCtx(ctx) {
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

  get env(): EnvRecord {
    return this._envs[this._envs.length - 1]
  }

  get envName(): string {
    return this.env.name
  }

  get envs(): EnvRecord[] {
    return this.isRoot() ? this._envs : [...new Set(this.parentCtx.envs.concat(this._envs))]
  }

  get envNames(): string {
    return this.envs.map(item => item.name).join(', ')
  }

  // 当前 context 中，所有命名的变量，
  // 用来生成顶部变量声明
  allVars: string[] = []

  // 当前 context 中，所有顶层的结点，
  // 销毁时，只需要移除树的顶层结点即可
  topLevelVars: string[] = []

  isRoot(): this is RootContext {
    return this instanceof RootContext
  }

  get code() {
    // return this._codes.join('')
    return this._code
  }

  get indentSpaces() {
    return this.repeat(this.spaceSize, this.indent)
  }

  get indent() {
    return this._indent
  }
  set indent(n: number) {
    this._indent = n
  }

  repeat(c: string, n: number): string {
    let ret = ''
    while (n--) {
      ret += c
    }
    return ret
  }

  declareIf(isTop = false) {
    const name = `${IF_PREFIX}${++this._ifIndex}`
    this.allVars.push(name)
    this.allVars.push(`${name}_com`)
    this.allVars.push(`${name}_val`)
    if (isTop) this.topLevelVars.push(name)
    return name
  }

  declareFor(isTop = false) {
    const name = `${FOR_PREFIX}${++this._forIndex}`
    this.allVars.push(name)
    this.allVars.push(`${name}_blocks`)
    this.allVars.push(`${name}_val`)
    if (isTop) this.topLevelVars.push(name)
    return name
  }

  declareHtml(isTop = false) {
    const name = `${HTML_PREFIX}${++this._htmlIndex}`
    this.allVars.push(name)
    this.allVars.push(`${name}_com`)
    this.allVars.push(`${name}_val`)
    if (isTop) this.topLevelVars.push(name)
    return name
  }

  declareElement(isTop = false) {
    const name = `${ELEMENT_PREFIX}${++this._eIndex}`
    this.allVars.push(name)
    if (isTop) this.topLevelVars.push(name)
    return name
  }

  declareText(isTop = false) {
    const name = `${TEXT_PREFIX}${++this._tIndex}`
    this.allVars.push(name, name + '_val')
    if (isTop) this.topLevelVars.push(name)
    return name
  }

  declareAttr(elName: string, attrName: string) {
    const name = `${elName}_${attrName}`
    this.allVars.push(name)
    return name
  }

  getCodeDeclareVars() {
    return this.indentSpaces + 'var ' + this.allVars.join(',') + '\n'
  }

  addBinding(binding: Binding) {
    this._binding.push(binding)
  }

  // 移除首尾空白后，首行以及每个换行位置自动插入指定缩进
  indentLines(code: string, indent = 0) {
    const spaces = this.repeat(this.spaceSize, indent)
    return (
      spaces +
      code.trim().replaceAll(/\n/g, newline => {
        return newline + spaces
      })
    )
  }

  appendCode(code: string) {
    // this._codes.push(code)
    this._code += code
  }

  prependCode(code: string) {
    // this._codes.unshift(code)
    this._code = code + this._code
  }

  prependLine(line: string) {
    this.prependCode(this.indentSpaces + line + '\n')
  }

  appendLine(line: string) {
    this.appendCode(this.indentSpaces + line + '\n')
  }

  // indent
  blockStart(line: string) {
    this.appendLine(line)
    this._indent += 1
  }

  // outdent
  blockEnd(line: string) {
    this._indent -= 1
    this.appendLine(line)
  }

  blockEndAndStart(line: string) {
    this._indent -= 1
    this.appendLine(line)
    this._indent += 1
  }
}

export class IfContext extends ContextBase {
  static uid = 0

  readonly type = ContextType.If

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string) {
    super()
    this._indent = 1
    this.varName = varName
    this.dataKey = dataKey
    this.makeFuncName = `/*If:${dataKey}*/make_if_${++IfContext.uid}`
  }
}

export class RootContext extends ContextBase {
  readonly type = ContextType.Root

  constructor() {
    super()
    this._envs = [EnvRecord.root()]
  }

  compile(): any /*Compiled*/ {
    return new Function('{dom, noop, resolve }', '{ data } = {}', this.code).bind(null, Object.assign(runtime))
  }
}

// 移除 indexEnv 支持，因为解析运行时开销原因，不支持表达式，不支持表达式直接传入 index 并没什么意义
export class ForContext extends ContextBase {
  static uid = 0

  readonly type = ContextType.For

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string, newEnv: string) {
    super()
    this._indent = 1
    this.varName = varName
    this.dataKey = dataKey
    this._envs.push(EnvRecord.for(newEnv))
    this.makeFuncName = `/*For:${dataKey}*/make_for_${++ForContext.uid}`
  }
}

export class HtmlContext extends ContextBase {
  static uid = 0

  readonly type = ContextType.Html

  varName: string
  dataKey: string
  makeFuncName: string

  constructor(varName: string, dataKey: string) {
    super()
    this._indent = 1
    this.varName = varName
    this.dataKey = dataKey
    this.makeFuncName = `/*Html:${dataKey}*/make_html_${++HtmlContext.uid}`
  }
}

export type Context = RootContext | IfContext | ForContext | HtmlContext
