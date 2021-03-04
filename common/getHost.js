
export function getHost(node) {
  while (node && node.nodeType !== 11) {
    node = node.parentNode
  }
  return node?.host
}
