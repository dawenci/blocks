export function strGetter(attr: string): (element: Element) => string | null {
  return element => element.getAttribute(attr)
}

/**
 * 设置为 null 表示清空
 */
export function strSetter(attr: string): (element: Element, value: any) => void {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return

    if (value === null) {
      element.removeAttribute(attr)
      return
    }

    element.setAttribute(attr, value)
  }
}

/**
 * 属性存在（无论值是什么）视为 true，否则 false
 */
export function boolGetter(attr: string): (element: Element) => boolean {
  return element => element.hasAttribute(attr)
}

/**
 * 布尔值 false 以及 null 表示 false（对应清空属性）
 * 其他值表示 true（对应设置属性）
 */
export function boolSetter(attr: string): (element: Element, value: any) => void {
  return (element, value) => {
    if (value === null || value === false) {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr)
      }
      return
    }

    if (!element.hasAttribute(attr)) {
      element.setAttribute(attr, '')
    }
  }
}

/**
 * 非有效数字，一律返回 null
 */
export function numGetter(attr: string): (element: Element) => number | null {
  return (element: Element) => {
    const rawValue = element.getAttribute(attr)
    if (rawValue == null) return null
    const value = parseFloat(rawValue)
    if (Object.is(value, NaN)) {
      return null
    }
    return value
  }
}

/**
 * 设置为 null 表示清空
 * 设置非法数字，则不做任何操作
 */
export function numSetter(attr: string): (element: Element, value: any) => void {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return

    if (value === null) {
      element.removeAttribute(attr)
      return
    }

    if (typeof value === 'number') {
      element.setAttribute(attr, String(value))
      return
    }

    if (Object.is(parseFloat(String(value)), NaN)) {
      return
    }

    element.setAttribute(attr, value)
  }
}

/**
 * 非有效数字，一律返回 null
 * 设置非整数，则不做任何操作
 */
export function intGetter(attr: string): (element: Element) => number | null {
  return element => {
    const rawValue = element.getAttribute(attr)
    if (rawValue == null) return null
    const value = parseInt(rawValue, 10)
    if (Object.is(value, NaN)) {
      return null
    }
    return value
  }
}

/**
 * 设置为 null 表示清空
 */
export function intSetter(attr: string): (element: Element, value: any) => void {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return

    if (value === null) {
      element.removeAttribute(attr)
      return
    }

    if (typeof value === 'number') {
      element.setAttribute(attr, String(Math.trunc(value)))
      return
    }

    if (Object.is(parseInt(String(value), 10), NaN)) {
      return
    }

    element.setAttribute(attr, value)
  }
}

/**
 * 非有效数字，一律返回 null
 */
export function intRangeGetter(attr: string, min: number, max: number): (element: Element) => number | null {
  return element => {
    const value = intGetter(attr)(element)
    if (value === null || value < min || value > max) return null
    return value
  }
}

/**
 * 设置为 null 表示清空
 * 设置无效整数，则不做任何操作
 */
export function intRangeSetter(attr: string, min: number, max: number): (element: Element, value: any) => void {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return

    if (value === null) {
      element.removeAttribute(attr)
      return
    }

    if (typeof value === 'number') {
      value = Math.trunc(value)
      if (value < min || value > max) return
      element.setAttribute(attr, String(value))
      return
    }

    value = parseInt(String(value), 10)
    if (Object.is(value, NaN) || value < min || value > max) {
      return
    }

    element.setAttribute(attr, value)
  }
}

/**
 * 取值不在枚举中，则返回 null
 */
export function enumGetter<T extends string>(attr: string, values: readonly T[]): (element: Element) => T | null {
  return element => {
    const value = element.getAttribute(attr) as T
    if (value === null) return null
    if (values.includes(value)) {
      return value
    }
    return null
  }
}

/**
 * 设置为 null，对应操作为清空属性
 * 传入不在枚举中的值，则不做任何操作
 */
export function enumSetter<T extends string>(
  attr: string,
  values: readonly T[]
): (element: Element, value: any) => void {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return

    if (value === null) {
      element.removeAttribute(attr)
      return
    }

    if (!values.includes(value as any)) {
      return
    }
    element.setAttribute(attr, value as unknown as string)
  }
}
