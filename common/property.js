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
    if (oldAttrValue === null && value === null) return
    if (oldAttrValue === String(value)) return
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
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function numGetter(attr, defaultValue = null) {
  return element => {
    const value = parseFloat(element.getAttribute(attr))
    if (Object.is(value, NaN)) return defaultValue
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function numSetter(attr, defaultValue) {
  return (element, value) => {
    // 新值无效
    if (Object.is(parseFloat(value), NaN)) {
      if (defaultValue === undefined) return
      value = defaultValue
    }
    const oldAttrValue = element.getAttribute(attr)
    // 新旧均为 null，返回
    if (oldAttrValue === null && value === null) return
    // 新值为 null，清空属性
    if (value === null) {
      element.removeAttribute(attr)
      return
    }
    // 新旧值相等
    if (oldAttrValue === String(value)) return
    element.setAttribute(attr, value)
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function intGetter(attr, defaultValue = null) {
  return element => {
    const value = parseInt(element.getAttribute(attr), 10)
    if (Object.is(value, NaN)) return defaultValue
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function intSetter(attr, defaultValue) {
  return (element, value) => {
    // 新值无效
    if (Object.is(parseInt(value, 10), NaN)) {
      if (defaultValue === undefined) return
      value = defaultValue
    }
    const oldAttrValue = element.getAttribute(attr)
    // 新旧均为 null，返回
    if (oldAttrValue === null && value === null) return
    // 新值为 null，清空属性
    if (value === null) {
      element.removeAttribute(attr)
      return
    }
    // 新旧值相等
    if (oldAttrValue === String(value)) return
    element.setAttribute(attr, value)
  } 
}

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => any}
 */
export function enumGetter(attr, values, defaultValue) {
  return (element) => {
    const value = element.getAttribute(attr)
    if (values.includes(value)) return value
    return defaultValue === undefined ? values[0] : defaultValue
  }
}

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function enumSetter(attr, values, defaultValue) {
  return (element, value) => {
    if (element.getAttribute(attr) === value) return
    if (!values.includes(value)) value = defaultValue === undefined ? values[0] : defaultValue
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
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function numRangeGetter(attr, min, max, defaultValue = null) {
  return element => {
    const value = parseFloat(element.getAttribute(attr))
    if (Object.is(value, NaN) || value < min || value > max) return defaultValue
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function numRangeSetter(attr, min, max, defaultValue) {
  return (element, value) => {
    // 新值无效
    const newValue = parseFloat(value)
    if (Object.is(newValue, NaN) || newValue < min | newValue > max) {
      if (defaultValue === undefined) return
      value = defaultValue
    }
    const oldAttrValue = element.getAttribute(attr)
    // 新旧均为 null，返回
    if (oldAttrValue === null && value === null) return
    // 新值为 null，清空属性
    if (value === null) {
      element.removeAttribute(attr)
      return
    }
    // 新旧值相等
    if (oldAttrValue === String(value)) return
    element.setAttribute(attr, value)
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function intRangeGetter(attr, min, max, defaultValue = null) {
  return element => {
    const value = parseInt(element.getAttribute(attr), 10)
    if (Object.is(value, NaN) || value < min || value > max) return defaultValue
    return value
  }
}

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function intRangeSetter(attr, min, max, defaultValue) {
  return (element, value) => {
    // 新值无效
    const newValue = parseInt(value, 10)
    if (Object.is(newValue, NaN) || newValue < min | newValue > max) {
      if (defaultValue === undefined) return
      value = defaultValue
    }
    const oldAttrValue = element.getAttribute(attr)
    // 新旧均为 null，返回
    if (oldAttrValue === null && value === null) return
    // 新值为 null，清空属性
    if (value === null) {
      element.removeAttribute(attr)
      return
    }
    // 新旧值相等
    if (oldAttrValue === String(value)) return
    element.setAttribute(attr, value)
  }
}
