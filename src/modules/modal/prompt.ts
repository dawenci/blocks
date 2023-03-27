import '../../components/input/index.js'
import type { ModalOptions } from './make.js'
import { modal } from './make.js'

/**
 * 弹出 prompt 框
 */
export function blPrompt(text: string, options: ModalOptions = {}) {
  const $input = document.createElement('bl-input')
  options.resolveValue = () => $input.value
  const { $dialog, promise } = modal(text, options)

  $dialog.appendChild($input)
  $dialog.addEventListener('focus', () => {
    requestAnimationFrame(() => {
      $input.focus()
    })
  })

  $input.onkeydown = e => {
    if (e.key === 'Enter') {
      $dialog.confirm()
    } else if (e.key === 'Escape' && $dialog.withCancel) {
      $dialog.cancel()
    }
  }

  return promise
}
