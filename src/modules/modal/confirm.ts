import type { ModalOptions } from './make.js'
import { modal } from './make.js'

/**
 * 弹出 confirm 框
 */
export function blConfirm(text: string, options: ModalOptions = {}) {
  if (options.cancel == null) options.cancel = true
  const { promise, $dialog } = modal(text, options)

  const onOpened = () => {
    if ($dialog.$cancel) {
      $dialog.$cancel.focus()
    }
  }
  $dialog.addEventListener('opened', onOpened)

  return promise
}
