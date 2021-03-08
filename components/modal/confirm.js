import '../dialog/index.js'
import '../button/index.js'
import { modal } from './modal.js'

/**
 * 弹出 confirm 框
 *
 * @export
 * @param {string} text 消息内容
 * @param {{ cancel: boolean, richMode: boolean, cancelText: string, confirmText: string, oncancel: () => any, onconfirm: () => any }} [options={}]
 * @returns {Promise<void>}
 */
export function blConfirm(text, options = {}) {
  if (!options.cancel) options.cancel = true
  const { promise } = modal(text, options)
  return promise
}
