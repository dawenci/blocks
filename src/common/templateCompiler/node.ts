enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_FRAGMENT_NODE = 11,
}

type AttrType = 'binding' | 'condition' | 'static'
export type ElemAttr = {
  name: string
  value: string | null
}

export type ParsedAttr = {
  type: AttrType
  name: string
  value: string
}

export type StaticText = {
  type: 'static'
  textContent: string
}

export type ReactiveText = {
  type: 'reactive'
  propName: string
}

export type ParsedText = StaticText | ReactiveText

export type FragmentNode = {
  nodeType: NodeType.DOCUMENT_FRAGMENT_NODE
  childNodes: ArrayLike<ElementNode | TextNode>
}

export type ElementNode = {
  nodeType: NodeType.ELEMENT_NODE
  nodeName: string
  attrs: Array<ElemAttr>
  childNodes: ArrayLike<ElementNode | TextNode>
}

export type TextNode = {
  nodeType: NodeType.TEXT_NODE
  nodeValue: string
}

export type BlNode =
  | FragmentNode
  | ElementNode
  | TextNode
  | Element
  | DocumentFragment
  | Text
  | ChildNode
export { BlNode as t }

export function isElem(node: BlNode): node is ElementNode | Element {
  return node.nodeType === 1
}

export function isFragment(
  node: BlNode
): node is FragmentNode | DocumentFragment {
  return node.nodeType === 11
}

export function isText(node: BlNode): node is TextNode | Text {
  return node.nodeType === 3
}

export function getAttrs(node: ElementNode | Element): ElemAttr[] {
  if ((node as ElementNode).attrs) {
    return (node as ElementNode).attrs
  }
  if ((node as Element).getAttributeNames) {
    return (node as Element).getAttributeNames().map(name => {
      const value = (node as Element).getAttribute(name)
      return { name, value }
    })
  }
  return []
}

export function parseAttrs(attrs: ElemAttr[]): ParsedAttr[] {
  const results: ParsedAttr[] = []
  attrs.forEach(attr => {
    const value = attr.value ?? ''
    let type: AttrType = 'static'
    let name = attr.name

    if (!!value) {
      if (name.startsWith('bl-if')) {
        type = 'condition'
        name = name.slice(5)
      } else if (name.startsWith('bl:')) {
        type = 'binding'
        name = name.slice(3)
      }
    }
    // 确保 bf-if 第一个
    if (type === 'condition') {
      results.unshift({ type, name, value })
    } else {
      results.push({ type, name, value })
    }
  })
  return results
}

export function parseText(text = ''): ParsedText[] {
  const results: ParsedText[] = []
  const len = text.length
  let substr = ''
  let i = -1
  let startPos = -1
  while (++i < len) {
    const ch = text[i]
    if (ch === '{') {
      if (substr) {
        results.push({ type: 'static', textContent: substr })
      }
      startPos = i
      substr = '{'
      continue
    }
    if (ch === '}') {
      if (startPos !== -1 && /^\{[a-z][a-z0-9]*$/i.test(substr)) {
        results.push({ type: 'reactive', propName: substr.slice(1) })
        startPos = -1
        substr = ''
        continue
      }
    }
    substr += ch
  }
  if (substr) {
    results.push({ type: 'static', textContent: substr })
  }
  // 相邻的 static 合并
  const reduceResults: Array<StaticText | ReactiveText> = []
  results.forEach(item => {
    const last = reduceResults[reduceResults.length - 1]
    if (!last) {
      return reduceResults.push(item)
    }
    if (last.type === 'static' && item.type === 'static') {
      last.textContent += item.textContent
    } else {
      reduceResults.push(item)
    }
  })
  return reduceResults
}

export function eachChild(
  node: Element | ElementNode | FragmentNode,
  fn: (child: ElementNode | TextNode | Element | Text) => void
): void {
  for (let i = 0, length = node.childNodes.length; i < length; i += 1) {
    const child = node.childNodes[i]
    if (isElem(child) || isText(child)) {
      fn(child)
    }
  }
}
