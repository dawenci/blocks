export function setRole(element, role) {
  element.setAttribute('role', role)
}

export function setDisabled(element, value) {
  if (value) {
    element.setAttribute('aria-disabled', 'true')
  }
  else {
    element.setAttribute('aria-disabled', 'false')
  }
}

export function setTabindex(element, value) {
  if (value === null || value === false) {
    element.removeAttribute('tabindex')
  }
  else {
    element.setAttribute('tabindex', typeof value === 'number' ? value : '0')
  }
}

export function updateDisabled(element) {
  setDisabled(element, element.disabled)
  setTabindex(element, !element.disabled)
}
