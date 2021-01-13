export function boolGetter(attr) {
  return element => element.hasAttribute(attr)
}

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

export function numGetter(attr) {
  return element => {
    const value = parseFloat(element.getAttribute(attr))
    return value
  }
}

export function numSetter(attr) {
  return (element, value) => {
    if (element.getAttribute(attr) === value) return
    element.setAttribute(attr, value)
  }
}

export function enumGetter(attr, values) {
  return (element) => {
    const value = element.getAttribute(attr)
    if (values.includes(value)) return value
    return values[0]
  }
}

export function enumSetter(attr, values) {
  return (element, value) => {
    if (element.getAttribute(attr) === value) return
    if (values.includes(value)) {
      element.setAttribute(attr, value)
    }
    else {
      element.setAttribute(attr, values[0])
    }
  }
}
