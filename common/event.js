
export function dispatchEvent(element, eventName, options = {}) {
  options = Object.assign({ bubbles: true, composed: true, cancelable: true }, options)
  const event = new CustomEvent(eventName, options)
  return element.dispatchEvent(event)
}

