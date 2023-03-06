export const Fragment = 'jsx.Fragment'

export const createElement = (
  type: string,
  props: Record<string, any>,
  ...children: Array<string | HTMLElement | DocumentFragment>
): HTMLElement | DocumentFragment => {
  let $el: HTMLElement | DocumentFragment
  if (type === Fragment) {
    $el = document.createDocumentFragment()
  } else {
    $el = document.createElement(type) as HTMLElement
    if (props) {
      Object.keys(props).forEach(prop => {
        ;($el as any)[prop] = props[prop]
      })
    }
  }

  children.forEach($child => {
    if (typeof $child === 'string') {
      $el.appendChild(document.createTextNode($child))
    } else {
      $el.appendChild($child)
    }
  })

  return $el
}

export type JsxFactory = {
  Fragment: string
  createElement: typeof createElement
}
