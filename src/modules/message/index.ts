import '../../components/message/index.js'
import { boolSetter, enumSetter, intSetter } from '../../common/property.js'

const closeableSetter = boolSetter('closeable')
const typeSetter = enumSetter('type', ['message', 'success', 'error', 'info', 'warning'])

function cage() {
  let cage = document.querySelector('.bl-message-cage') as HTMLElement
  if (!cage) {
    cage = document.body.appendChild(document.createElement('div'))
    cage.className = `bl-message-cage`
    const cssText =
      'pointer-events:none;overflow:hidden;position:fixed;z-index:100;top:0;bottom:auto;left:0;right:0;display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;padding:8px 0;'
    cage.style.cssText = cssText
  }
  return cage
}

export interface MessageOptions {
  type?: any
  closeable?: boolean
  duration?: number
  content?: string
}

export function blMessage(options: MessageOptions = {}) {
  const el = document.createElement('bl-message')
  typeSetter(el, options.type)
  closeableSetter(el, options.closeable ?? false)
  if (options.duration != null) intSetter('duration')(el, options.duration)

  const content = options.content

  el.innerHTML = content ?? ''
  el.style.cssText = `transform:translate(0, -100%);opacity:0;`

  cage().appendChild(el)

  el.offsetHeight
  el.style.cssText = `transform:translate(0, 0);opacity:1;`

  let closedCallback: () => void
  let closed = false
  const onClosed = () => {
    closed = true
    if (closedCallback) closedCallback()
    el.removeEventListener('closed', onClosed)
  }
  el.addEventListener('closed', onClosed)

  return {
    el,
    close() {
      el.close()
      return this
    },
    onclose(callback: () => void) {
      if (closed) {
        callback()
      } else {
        closedCallback = callback
      }
      return this
    },
  }
}
