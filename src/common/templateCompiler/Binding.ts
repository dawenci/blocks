import type { Context, IfContext, ForContext, HtmlContext } from './Context.js'
import { EnvRecord } from './EnvRecord.js'

export const enum BindingType {
  Attr,
  Text,
  Event,
  If,
  For,
  Html,
}

export type Binding = AttrBinding | EventBinding | TextBinding | IfBinding | ForBinding | HtmlBinding

function isSimpleName(name: string): boolean {
  return /^[_$a-z][_$a-z0-9]*$/i.test(name)
}

const DOT = 46
const BRACKET_START = 91
const BRACKET_END = 93
const DOUBLE_QUOTATION = 34
const SINGLE_QUOTATION = 39
const SPACE = 32
function path(str: string): string[] {
  const output: string[] = []
  let start = false
  let quotation = 0
  let sliceFrom = 0

  const len = str.length

  main: for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i)

    if (ch === DOT && !start) {
      if (i > sliceFrom) {
        output.push(str.slice(sliceFrom, i))
      }
      sliceFrom = i + 1
      continue
    }

    if (!quotation && ch === BRACKET_START) {
      let j = i + 1
      for (; j < len; j += 1) {
        const ch2 = str.charCodeAt(j)
        if (ch2 === SPACE) continue
        if (ch2 === SINGLE_QUOTATION || ch2 === DOUBLE_QUOTATION) {
          if (i > sliceFrom) {
            output.push(str.slice(sliceFrom, i))
          }
          start = true
          quotation = ch2
          i = j
          sliceFrom = i + 1
          continue main
        }
        break
      }
    }

    if (start && ch === quotation) {
      let j = i + 1
      for (; j < len; j += 1) {
        const ch2 = str.charCodeAt(j)
        if (ch2 === SPACE) continue
        if (ch2 === BRACKET_END) {
          if (i > sliceFrom) {
            output.push(str.slice(sliceFrom, i))
          }
          start = false
          quotation = 0
          i = j
          sliceFrom = i + 1
          continue main
        }
        break
      }
    }
  }

  if (sliceFrom < len) {
    output.push(str.slice(sliceFrom))
  }

  return output
}

// .replaceAll(/['"]/g, str => `\\${str}`)
class BindingBase {
  isIndex?: boolean

  get env(): EnvRecord {
    return getEnv(this as unknown as Binding)
  }

  get envName(): string {
    return this.env.name
  }

  get dataKey(): string {
    return getDataKey(this as unknown as Binding)
  }

  /**
   * 考虑到运行时编译耗时，
   * dataKey 仅支持变量访问、对象成员访问、嵌套对象成员访问
   * 不考虑支持表达式（解析耗时太大）
   * 所以，模板所需数据需要处理完毕再传入
   */
  get resolved() {
    const { envName, dataKey } = this

    if (isSimpleName(dataKey)) {
      return `resolve(envs.${envName},${JSON.stringify(dataKey)})`
    }

    const ret = `resolve(envs.${envName},${path(dataKey)
      .map(key => JSON.stringify(key))
      .join(',')})`

    return ret
  }
}

export class IfBinding extends BindingBase {
  readonly type = BindingType.If

  constructor(public context: Context, public childCtx: IfContext, public varName: string, public rawDataKey: string) {
    super()
  }
}

export class AttrBinding extends BindingBase {
  readonly type = BindingType.Attr
  constructor(
    public context: Context,
    public varName: string,
    public rawDataKey: string,
    public attrName: string,
    public attrVal: string,
    public isProp: boolean
  ) {
    super()
  }
}

export class EventBinding extends BindingBase {
  readonly type = BindingType.Event
  constructor(
    public context: Context,
    public varName: string,
    public rawDataKey: string,
    public attrVal: string,
    public eventType: string,
    public eventFlag: number
  ) {
    super()
  }
}

export class TextBinding extends BindingBase {
  readonly type = BindingType.Text
  constructor(public context: Context, public varName: string, public rawDataKey: string) {
    super()
  }
}

export class ForBinding extends BindingBase {
  readonly type = BindingType.For
  constructor(public context: Context, public forCtx: ForContext, public varName: string, public rawDataKey: string) {
    super()
  }
}

export class HtmlBinding extends BindingBase {
  readonly type = BindingType.Html
  constructor(
    public context: Context,
    public childCtx: HtmlContext,
    public varName: string,
    public rawDataKey: string
  ) {
    super()
  }
}

export function getEnv(binding: Binding): EnvRecord {
  if (!binding.rawDataKey.includes('.')) {
    // root
    return binding.context.envs[0]
  }

  const prefix = binding.rawDataKey.split('.')[0].trim()
  return binding.context.envs.findLast(env => env.rawName === prefix) ?? binding.context.envs[0]
}

export function getDataKey(binding: Binding): string {
  const env = getEnv(binding)
  const rawDataKey = binding.rawDataKey.trim()
  return rawDataKey.startsWith(env.rawName + '.') ? rawDataKey.slice(env.rawName.length + 1) : rawDataKey
}
