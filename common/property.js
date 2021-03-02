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
    if (value === null) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  }
}

export function intGetter(attr) {
  return element => {
    const value = parseInt(element.getAttribute(attr))
    return value
  }
}

export function intSetter(attr) {
  return (element, value) => {
    value = parseInt(value, 10)
    if (parseInt(element.getAttribute(attr), 10) === value) return
    if (value === null) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
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
    if (!values.includes(value)) value = values[0]
    if (value === null) {
      element.removeAttribute(attr)
    }
    else {
      element.setAttribute(attr, value)
    }
  }
}
