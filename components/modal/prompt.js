import '../dialog/index.js'
import '../button/index.js'
import '../input/index.js'
import { modal } from './modal.js'

/**
 * 弹出 confirm 框
 *
 * @export
 * @param {string} text 消息内容
 * @param {{ cancel: boolean, richMode: boolean, cancelText: string, confirmText: string, oncancel: () => any, onconfirm: () => any }} [options={}]
 * @returns {Promise<void>}
 */
export function prompt(text, options = {}) {
  const input = document.createElement('blocks-input')
  options.resolveValue = () => input.value
  const { $dialog, promise } = modal(text, options)

  $dialog.appendChild(input)
  $dialog.addEventListener('focus', () => {
    requestAnimationFrame(() => {
      input.focus()
    })
  })

  input.onkeydown = e => {
    if (e.key === 'Enter') {
      $dialog.confirm()
    }
  }

  return promise
}
