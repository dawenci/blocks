import * as runtime from './runtime/index.js'
import * as BlNode from './node.js'
import { generateCode } from './generate.js'

export type ViewInstance = {
  create: () => DocumentFragment
  update: () => DocumentFragment
  destroy: () => void
  set: (model: runtime.BlModel | Record<string, any>) => void
}

export type ViewMaker = (options: { model: any }) => ViewInstance

export function compile(root: BlNode.t): { make: ViewMaker; code: string } {
  const { code } = generateCode(root)

  console.time('COMPILE_CODE')
  const result = new Function('{dom,noop,resolve,BlModel,BlEvent}', '{model}={}', code).bind(
    null,
    Object.assign(runtime)
  )
  console.timeEnd('COMPILE_CODE')

  return {
    get make() {
      return result
    },

    get code() {
      return code
    },
  }
}
