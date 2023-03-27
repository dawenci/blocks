import * as BlNode from './node.js'

export const Fragment = 'jsx.Fragment'

export const createElement = (
  type: string,
  props: Record<string, any>,
  ...children: Array<string | BlNode.t | BlNode.BlFragment>
): BlNode.t | BlNode.IFragment => {
  const childNodes: BlNode.t[] = []

  const pushChild = (children: Array<string | BlNode.t | BlNode.BlFragment>) => {
    children.forEach($child => {
      if (typeof $child === 'string') {
        childNodes.push(new BlNode.BlText($child))
      } else if ($child.nodeType === 1) {
        childNodes.push($child)
      } else if ($child.nodeType === 11) {
        childNodes.push(new BlNode.BlTemplate(new BlNode.BlFragment($child.childNodes)))
      }
    })
  }
  pushChild(children)

  let $el: BlNode.t | BlNode.IFragment
  if (type === Fragment) {
    $el = new BlNode.BlTemplate(new BlNode.BlFragment(childNodes))
  } else {
    type = type.toUpperCase()
    if (type === 'TEMPLATE') {
      $el = new BlNode.BlTemplate(new BlNode.BlFragment(childNodes))
    } else {
      $el = new BlNode.BlElement(type, new BlNode.BlAttributes(props ?? {}), childNodes)
    }
  }

  return $el
}

export type JsxFactory = {
  Fragment: string
  createElement: typeof createElement
}
