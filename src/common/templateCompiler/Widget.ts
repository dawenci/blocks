import * as BlNode from './node.js'
import { ViewInstance, compile } from './compile.js'
import { JsxFactory, createElement, Fragment } from './jsx.js'
import { BlModel, dom } from './runtime/index.js'

export function Widget(template: (jsx: JsxFactory) => BlNode.t) {
  const blNode = template({ createElement, Fragment })
  const { code, make } = compile(blNode)

  class _Widget {
    view: ViewInstance
    model: BlModel
    code = code

    constructor(model: BlModel, $mountPoint: HTMLElement) {
      this.model = model
      this.view = make({ model })
      dom.append($mountPoint, this.view.create())
    }

    setModel(model: any) {
      this.view.set((this.model = model))
    }

    update() {
      this.view.update()
    }

    destroy() {
      this.view.destroy()
      this.model.off()
    }
  }

  return function make(model: BlModel, $mountPoint: HTMLElement) {
    return new _Widget(model, $mountPoint)
  }
}
