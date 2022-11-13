import { modal, ModalOptions } from './make.js'

/**
 * 弹出 confirm 框
 */
export function blConfirm(text: string, options: ModalOptions = {}) {
  if (options.cancel == null) options.cancel = true
  const { promise } = modal(text, options)
  return promise
}
