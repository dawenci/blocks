import { modal, ModalOptions } from './make.js'

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
    }
  }

  return promise
}
