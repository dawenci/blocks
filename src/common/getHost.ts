export function getHost(node: Node | null): Element {
  while (node && node.nodeType !== 11) {
    node = node.parentNode
  }
  return (node as any)?.host as Element
}
