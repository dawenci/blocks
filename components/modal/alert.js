import '../dialog/index.js'
import '../button/index.js'
import { modal } from './modal.js'

/**
 * 弹出 alert 框
 *
 * @export
 * @param {string} text 消息内容
 * @param {{ richMode: boolean, cancelText: string, confirmText: string, onconfirm: () => any }} [options={}]
 * @returns {Promise<void>}
 */
export function alert(text, options = {}) {
  if (options.cancel) options.cancel = false
  const { promise } = modal(text, options)
  return promise
}
