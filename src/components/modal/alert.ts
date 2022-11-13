import { modal, ModalOptions } from './make.js'

/**
 * 弹出 alert 框
 */
export function blAlert(text: string, options: ModalOptions = {}) {
  options.cancel = false
  const { promise } = modal(text, options)
  return promise
}
