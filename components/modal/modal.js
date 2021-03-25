import '../dialog/index.js'
import '../button/index.js'
import '../input/index.js'

/**
 * 弹出 confirm 框
 *
 * @export
 * @param {string} text 消息内容
 * @param {{ cancel?: boolean, richMode?: boolean, cancelText?: string, confirmText?: string, oncancel?: () => any, onconfirm?: () => any, resolveValue?: () => any, rejectValue?: () => any }} [options={}]
 * @returns {Promise<void>}
 */
export function modal(text, options = {}) {
  const $dialog = document.body.appendChild(document.createElement('bl-dialog'))
  const content = $dialog.appendChild(document.createElement('div'))
  const promise = new Promise((resolve, reject) => {
    $dialog.mask = true
    $dialog.capturefocus = true

    // 消息内容区域
    if (text) {
      content.style.cssText = 'min-width:200px;padding:20px 0;'

      // 内容是否富文本
      if (options.richMode) {
        const node = document.createElement('div')
        node.innerHTML = text
        content.appendChild(node)
      }
      else {
        content.appendChild(document.createTextNode(text))
      }
    }

    // 取消按钮
    if (options.cancel) {
      const $cancelButton = document.createElement('bl-button')
      $cancelButton.setAttribute('slot', 'footer')
      $cancelButton.className = 'cancel'
      $cancelButton.style.marginRight = '8px'
      $cancelButton.textContent = options.cancelText ?? '取消'
      $dialog.appendChild($cancelButton)
      $dialog.cancel = () => {
        $dialog.open = false
        const value = options.rejectValue?.() ?? new Error('cancel')
        if (options.oncancel) options.oncancel(value)
        reject(value)
      }
      $cancelButton.onclick = $dialog.cancel
    }

    // 确认按钮
    const $confirmButton = document.createElement('bl-button')
    $confirmButton.setAttribute('type', 'primary')
    $confirmButton.setAttribute('slot', 'footer')
    $confirmButton.className = 'confirm'
    $confirmButton.textContent = options.confirmText ?? '确定'
    $dialog.appendChild($confirmButton)
    $dialog.confirm = () => {
      $dialog.open = false
      const value = options.resolveValue?.() ?? ''
      if (options.onconfirm) options.onconfirm(value)
      resolve(value)
    }
    $confirmButton.onclick = $dialog.confirm

    $dialog.onkeydown = e => {
      if (e.target === $dialog) {
        if (e.key === 'Enter') {
          $dialog.confirm()
        }
        else if (e.key === 'Escape' && options.cancel) {
          $dialog.cancel()
        }
      }
    }

    // 打开对话框
    $dialog.open = true
  })

  promise.catch(() => {})

  return {
    promise,
    $dialog,
  }
}
