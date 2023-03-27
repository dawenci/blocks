import type { ModalOptions } from './make.js'
import { modal } from './make.js'

/**
 * 弹出 alert 框
 */
export function blAlert(text: string, options: ModalOptions = {}) {
  options.cancel = false
  const { promise, $dialog } = modal(text, options)

  const onOpened = () => {
    if ($dialog.$confirm) {
      $dialog.$confirm.focus()
    }
  }
  $dialog.addEventListener('opened', onOpened)

  return promise
}
