const enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_FRAGMENT_NODE = 11,
}

export type IAttr = Attr | { name: string; value: string }

export type IAttributes = ArrayLike<IAttr>

export class BlAttributes implements IAttributes {
  [index: number]: IAttr
  length: number
  constructor(props: Record<string, any>) {
    const keys = Object.keys(props ?? {})
    this.length = keys.length

    keys.forEach((prop, index) => {
      const attr = { name: prop, value: props[prop] } as IAttr
      this[index] = attr
      // this[prop] = attr
    })
  }
}

export interface IFragment {
  nodeType: NodeType.DOCUMENT_FRAGMENT_NODE
  childNodes: ArrayLike<BlNode>
}

export type IText = {
  nodeType: NodeType.TEXT_NODE
  nodeValue: string
}

export interface IElement {
  nodeType: NodeType.ELEMENT_NODE
  nodeName: string
  attributes: IAttributes
  childNodes: ArrayLike<BlNode>
  hasAttribute(name: string): boolean
  getAttribute(name: string): string | null
  setAttribute(name: string, value: string | null): void
  removeAttribute(name: string): void
}

export interface ITemplate extends IElement {
  content: IFragment
}

export class BlFragment implements IFragment {
  nodeType = NodeType.DOCUMENT_FRAGMENT_NODE as const
  constructor(public childNodes: ArrayLike<BlNode>) {}
}

export class BlElement implements IElement {
  nodeType = NodeType.ELEMENT_NODE as const
  constructor(public nodeName: string, public attributes: IAttributes, public childNodes: ArrayLike<BlNode>) {}

  hasAttribute(name: string): boolean {
    const attrs = this.attributes
    for (let i = 0, l = attrs.length; i < l; i += 1) {
      if (attrs[i].name === name) return true
    }
    return false
  }

  getAttribute(name: string): string | null {
    const attrs = this.attributes
    for (let i = 0, l = attrs.length; i < l; i += 1) {
      if (attrs[i].name === name) return attrs[i].value
    }
    return null
  }

  setAttribute(name: string, value: string): void {
    const attrs = this.attributes
    for (let i = 0, l = attrs.length; i < l; i += 1) {
      if (attrs[i].name === name) {
        attrs[i].value = value
        break
      }
    }
  }

  removeAttribute(name: string): void {
    const attrs = Array.prototype.slice.call(this.attributes)
    let flag = false
    for (let i = 0, l = attrs.length; i < l; i += 1) {
      if (flag) {
        attrs[i - 1] = attrs[i]
        continue
      }
      if (attrs[i].name === name) {
        flag = true
      }
    }
  }
}

export class BlTemplate extends BlElement implements ITemplate {
  constructor(public content: IFragment) {
    super('TEMPLATE', { length: 0 }, { length: 0 })
  }
}

export class BlText implements IText {
  nodeType = NodeType.TEXT_NODE as const
  constructor(public nodeValue: string) {}
}

export function isElem(node: BlNode): node is IElement | Element {
  return node.nodeType === 1
}

export function isFragment(node: unknown): node is IFragment | DocumentFragment {
  return (node as any).nodeType === 11
}

export function isText(node: BlNode): node is IText | Text {
  return node.nodeType === 3
}

export function hasAttr(node: IElement | Element, name: string): boolean {
  if ((node as IElement).attributes) {
    const attrs = node.attributes
    for (let i = 0, l = attrs.length; i < l; i += 1) {
      const attr = attrs[i]
      if (attr.name === name) return true
    }
    return false
  }
  if ((node as Element).hasAttribute) {
    return (node as Element).hasAttribute(name)
  }
  return false
}

export function getAttr(node: IElement | Element, name: string): string | null {
  return node.getAttribute(name)
}

export function getAttrs(node: IElement | Element): ArrayLike<IAttr> {
  return node.attributes
}

export function children(node: BlNode | IFragment | DocumentFragment): BlNode[] {
  return Array.from((node as any).childNodes)
}

export type BlNode = IElement | ITemplate | IText | Element | Text | ChildNode

export { BlNode as t }
