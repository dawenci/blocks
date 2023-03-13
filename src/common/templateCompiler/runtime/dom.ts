export function fragment() {
  return document.createDocumentFragment()
}

export function element<K extends keyof HTMLElementTagNameMap>(name: K) {
  return document.createElement<K>(name)
}

export function text(data: string) {
  return document.createTextNode(data)
}

export function comment(text?: string) {
  return document.createComment(text ?? '')
}

export function space() {
  return text(' ')
}

export function empty() {
  return text('')
}

export function attr(node: Element, attribute: string, value?: string) {
  if (value == null) node.removeAttribute(attribute)
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value)
}

export function prop(node: Element, prop: string, value?: any) {
  ;(node as any)[prop] = value
}

export function append(target: Node, node: Node) {
  return target.appendChild(node)
}

export function insert(target: Node, node: Node, anchor: Node | null = null) {
  return target.insertBefore(node, anchor)
}

export function before(anchor: Node, node: Node) {
  return insert(anchor.parentNode!, node, anchor)
}

export function detach(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node)
  }
}

export function replace(node: Node, anchor: Node) {
  const result = insert(anchor.parentNode!, node, anchor)
  detach(anchor)
  return result
}

export function next(node: Node) {
  return node.nextSibling
}

export function prev(node: Node) {
  return node.previousSibling
}

export function event(node: Node, eventType: string, handle: ((e: Event) => void) | null, eventFlag = 0) {
  const map: Map<string, any> = (node as any).__eventMap__ || ((node as any).__eventMap__ = new Map())

  const key = eventType + '.' + eventFlag
  const oldHandle = map.get(key)
  if (oldHandle) {
    if (oldHandle === handle || oldHandle.__raw === handle) return
    node.removeEventListener(eventType, oldHandle)
    map.delete(key)
    if (handle === null) return
  }

  if (handle === null) return
  if (eventFlag) {
    function wrapper(this: any, e: Event) {
      if (eventFlag & 0b00000010) e.preventDefault()
      if (eventFlag & 0b00000100) e.stopPropagation()
      if (eventFlag & 0b00001000) e.stopImmediatePropagation()

      handle!.call(this, e)

      // once
      if (eventFlag & 0b00010000) {
        event(node, eventType, null, eventFlag)
      }
    }
    wrapper.__raw = handle
    node.addEventListener(eventType, wrapper, {
      capture: !!(eventFlag & 0b00000001),
      passive: !!(eventFlag & 0b00100000),
      // once: !!(eventFlag & 0b00010000),
    })
    map.set(key, wrapper)
  } else {
    node.addEventListener(eventType, handle)
    map.set(key, handle)
  }
}

export function parseHtml(html: string): Node[] {
  const $temp = document.createElement('div')
  $temp.innerHTML = html || ''
  return Array.prototype.slice.call($temp.childNodes)
}
