
export function onKey(key, handler) {
  const internalHandler = e => {
    if (e.defaultPrevented) return
    const parsedKey = parseKey(key)
    if (parsedKey.ctrlKey && !e.ctrlKey) return
    if (parsedKey.shiftKey && !e.shiftKey) return
    if (parsedKey.altKey && !e.altKey) return
    if (parsedKey.keyName === eventKeyName(e)) {
      handler(e)
    }
  }

  document.addEventListener('keydown', internalHandler)

  return () => {
    document.removeEventListener('keydown', internalHandler)
  }
}

function eventKeyName(e) {
  return e.key.toLowerCase?.() ?? ''
}

function parseKey(key) {
  let ctrlKey = false
  let shiftKey = false
  let altKey = false
  let keyName = ''

  key.toLowerCase().split('-').forEach(k => {
    if (k === 'ctrl') ctrlKey = true
    else if (k === 'shift') shiftKey = true
    else if (k === 'alt') altKey = true
    keyName = k
  })

  return {
    ctrlKey,
    shiftKey,
    altKey,
    keyName
  }
}
