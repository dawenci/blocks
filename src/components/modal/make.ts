import { unmount } from '../../common/mount.js'
import './modal.js'

export interface ModalOptions {
  cancel?: boolean
  richMode?: boolean
  cancelText?: string
  confirmText?: string
  onCancel?: (err: any) => any
  onConfirm?: (value: any) => any
  resolveValue?: () => any
  rejectValue?: () => any
}

/**
 * 弹出 modal 框
 */
export function modal(text: string, options: ModalOptions = {}) {
  const $dialog = document.body.appendChild(document.createElement('bl-modal'))
  $dialog.withConfirm = true
  $dialog.withCancel = !!options.cancel
  $dialog.rich = !!options.richMode
  if (options.resolveValue) $dialog.resolveValue = options.resolveValue
  if (options.rejectValue) $dialog.resolveValue = options.rejectValue
  if (options.confirmText) $dialog.confirmText = options.confirmText
  if (options.cancelText) $dialog.cancelText = options.cancelText
  if (options.onConfirm) $dialog.onConfirm = options.onConfirm
  if (options.onCancel) $dialog.onCancel = options.onCancel
  $dialog.open = true
  $dialog.content = text
  const promise = $dialog.promise
  $dialog.addEventListener('closed', () => {
    unmount($dialog)
  })

  return {
    promise,
    $dialog,
  }
}
