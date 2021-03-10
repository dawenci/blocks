/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => boolean}
 */
export function boolGetter(attr) {
  return element => element.hasAttribute(attr)
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function boolSetter(attr) {
  return (element, value) => {
    if (value === null || value === false) {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr)
      }
    }
    else {
      if (!element.hasAttribute(attr)) {
        element.setAttribute(attr, '')
      }
    }
  }
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => number}
 */
export function numGetter(attr) {
  return element => {
    const value = parseFloat(element.getAttribute(attr))
    if (Object.is(value, NaN)) return null
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function numSetter(attr) {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    // null、内容为数字的字符串
    if (oldAttrValue === value || oldAttrValue === String(value)) return

    if (Object.is(parseFloat(value), NaN)) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  }
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => number}
 */
export function intGetter(attr) {
  return element => {
    const value = parseInt(element.getAttribute(attr), 10)
    if (Object.is(value, NaN)) return null
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function intSetter(attr) {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    // null、内容为数字的字符串
    if (oldAttrValue === value || oldAttrValue === String(value)) return

    if (Object.is(parseInt(value, 10), NaN)) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  } 
}

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @returns {(element: Element) => any}
 */
export function enumGetter(attr, values) {
  return (element) => {
    const value = element.getAttribute(attr)
    if (values.includes(value)) return value
    return values[0]
  }
}

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @returns {(element: Element, value: any) => void}
 */
export function enumSetter(attr, values) {
  return (element, value) => {
    if (element.getAttribute(attr) === value) return
    if (!values.includes(value)) value = values[0]
    if (value === null) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  }
}

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => string | null}
 */
export function strGetter(attr) {
  return element => element.getAttribute(attr)
}

/**
 *
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function strSetter(attr) {
  return (element, value) => {
    const oldAttrValue = element.getAttribute(attr)
    if (oldAttrValue === value || oldAttrValue === String(value)) return
    if (value === null) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  }
}
