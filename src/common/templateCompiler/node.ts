enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_FRAGMENT_NODE = 11,
}

export type ElemAttr = {
  name: string
  value: string | null
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

export type BlNode = FragmentNode | ElementNode | TextNode | Element | DocumentFragment | Text | ChildNode
export { BlNode as t }

export function isElem(node: BlNode): node is ElementNode | Element {
  return node.nodeType === 1
}

export function isFragment(node: BlNode): node is FragmentNode | DocumentFragment {
  return node.nodeType === 11
}

export function isText(node: BlNode): node is TextNode | Text {
  return node.nodeType === 3
}

export function hasAttr(node: ElementNode | Element, name: string): boolean {
  if ((node as ElementNode).attrs) {
    return (node as ElementNode).attrs.some(item => item.name === name)
  }
  if ((node as Element).hasAttribute) {
    return (node as Element).hasAttribute(name)
  }
  return false
}

export function getAttr(node: ElementNode | Element, name: string): string | null {
  if ((node as ElementNode).attrs) {
    return (node as ElementNode).attrs.find(item => item.name === name)?.value ?? null
  }
  if ((node as Element).getAttribute) {
    return (node as Element).getAttribute(name)
  }
  return ''
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

export function makeEventFlag(flags: string[]): number {
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

// TODO, 重写，以支持各种变量访问语法，例如:
// {varName}, {obj.propName}, {obj['propName']}, {obj["propName"]}
// {env.varName}, {env.obj.propName}, {env.obj['propName']}, {env.obj["propName"]}
const BRACE_START = 123
const BRACE_END = 125
const DOUBLE_QUOTATION = 34
const SINGLE_QUOTATION = 39
const BACKSLASH = 92
export function parseText(text = ''): ParsedText[] {
  const results: ParsedText[] = []
  const len = text.length
  let top: StaticText | null = null
  let escape = false
  let strStart = 0
  let sliceFrom = 0
  let i = -1
  let startPos = -1
  while (++i < len) {
    const ch = text.charCodeAt(i)

    // 花括号开始
    if (ch === BRACE_START && !strStart) {
      if (i > sliceFrom) {
        if (top) {
          // 相邻的 static text 合并
          top.textContent += text.slice(sliceFrom, i)
        } else {
          results.push((top = { type: 'static', textContent: text.slice(sliceFrom, i) }))
        }
      }
      startPos = sliceFrom = i
      continue
    }

    // 花括号结束
    if (ch === BRACE_END && startPos !== -1 && !strStart) {
      if (i > sliceFrom) {
        results.push({ type: 'reactive', propName: text.slice(sliceFrom + 1, i) })
        top = null
        startPos = -1
        sliceFrom = i + 1
        continue
      }
    }

    // 单引号、双引号（字符串开始、结束）
    if ((ch === SINGLE_QUOTATION || ch === DOUBLE_QUOTATION) && startPos !== -1) {
      // 解析 string 中
      if (strStart) {
        if (ch === strStart) {
          if (!escape) {
            // string end
            strStart = 0
          } else {
            escape = false
          }
        }
      } else {
        strStart = ch
      }
    }

    // 字符串中反斜杠作为 escape 符号
    if (ch === BACKSLASH && strStart && !escape) {
      escape = true
    }
  }

  if (sliceFrom < i) {
    if (top) {
      top.textContent += text.slice(sliceFrom)
    } else {
      results.push((top = { type: 'static', textContent: text.slice(sliceFrom) }))
    }
  }

  return results
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

export function children(node: BlNode): BlNode[] {
  return Array.from((node as any).childNodes)
}
