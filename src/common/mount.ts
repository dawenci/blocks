export const prepend = <T extends Node>($el: T, $parent: Node) => {
  if ($parent.firstChild) {
    $parent.insertBefore($el, $parent.firstChild)
  } else {
    $parent.appendChild($el)
  }
  return $el
}

export const append = <T extends Node>($el: T, $parent: Node) => {
  return $parent.appendChild($el)
}

export const mountBefore = <T extends Node>($el: T, $exists: Node) => {
  if ($exists.parentNode) {
    $exists.parentNode.insertBefore($el, $exists)
  }
  return $el
}

export const mountAfter = <T extends Node>($el: T, $exists: Node) => {
  if ($exists.parentNode) {
    if ($exists.nextSibling) {
      $exists.parentNode.insertBefore($el, $exists.nextSibling)
    } else {
      $exists.parentNode.appendChild($el)
    }
  }
  return $el
}

export const unmount = <T extends Node>($el: T) => {
  if ($el.parentNode) {
    $el.parentNode.removeChild($el)
  }
  return $el
}
