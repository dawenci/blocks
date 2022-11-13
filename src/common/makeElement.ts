interface MakeElementOptions<K extends keyof HTMLElementTagNameMap> {
  tagName: K
  props?: Record<string, any>
  attrs?: Record<string, string>
  styles?: Record<string, string>
  children?: Array<string | MakeElementOptions<keyof HTMLElementTagNameMap>>
}

export function makeElement(text: string): Text
export function makeElement<K extends keyof HTMLElementTagNameMap>(
  options: MakeElementOptions<K>
): HTMLElementTagNameMap[K]
export function makeElement<K extends keyof HTMLElementTagNameMap>(
  options: MakeElementOptions<K> | string
): Text | HTMLElementTagNameMap[K] {
  if (typeof options === 'string') {
    return document.createTextNode(options)
  }

  const $el = document.createElement(options.tagName)
  if (options?.attrs) {
    Object.keys(options.attrs).forEach(attrName => {
      $el.setAttribute(attrName, options.attrs![attrName])
    })
  }

  if (options?.props) {
    Object.keys(options.props).forEach(prop => {
      ;($el as any)[prop] = options.props![prop]
    })
  }

  if (options?.styles) {
    Object.keys(options.styles).forEach(prop => {
      ;($el as any).style[prop] = options.styles![prop]
    })
  }

  ;(options.children ?? []).forEach(child => {
    const $child = makeElement(child as any)
    $el.appendChild($child)
  })
  return $el
}
