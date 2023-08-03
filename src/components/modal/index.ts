import type { BlButton } from '../button/index.js'
import '../button/index.js'
import '../dialog/index.js'
import '../input/index.js'
import { append, prepend, unmount } from '../../common/mount.js'
import { attr } from '../../decorators/attr/index.js'
import { cancelButtonTemplate, confirmButtonTemplate, contentTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { strGetter, strSetter } from '../../common/property.js'
import { style } from './style.js'
import { BlDialog } from '../dialog/index.js'

export interface BlModal extends BlDialog {
  onConfirm?: (value: any) => any
  onCancel?: (value: any) => any
}

@defineClass({
  customElement: 'bl-modal',
  styles: [style],
})
export class BlModal extends BlDialog {
  #promise?: Promise<any>
  #resolve?: any
  #reject?: any

  static override get observedAttributes() {
    return super.observedAttributes.concat(['resolve-value', 'reject-value'])
  }

  @attr('boolean') accessor withConfirm!: boolean
  @attr('boolean') accessor withCancel!: boolean
  @attr('string') accessor confirmText!: string | null
  @attr('string') accessor cancelText!: string | null
  @attr('boolean') accessor rich!: boolean
  @attr('string') accessor content!: string | null

  get $confirm(): BlButton | null {
    return this.querySelectorHost('[part="confirm-button"]')
  }
  get $cancel(): BlButton | null {
    return this.querySelectorHost('[part="cancel-button"]')
  }
  get $content(): HTMLElement | null {
    return this.querySelectorHost('[part="content"]')
  }

  constructor() {
    super()

    this.#setupDialog()
    this.#setupConfirm()
    this.#setupCancel()
    this.#setupContent()
    this.#setupKeymap()
    this.#setupPromise()
  }

  #resolveValue?: () => any
  get resolveValue() {
    return this.#resolveValue ?? strGetter('resolve-value')(this)
  }

  set resolveValue(value: any) {
    if (typeof value === 'function') {
      this.#resolveValue = value
    } else {
      strSetter('resolve-value')(this, value)
    }
  }

  #rejectValue?: () => any
  get rejectValue() {
    return this.#rejectValue ?? strGetter('reject-value')(this)
  }

  set rejectValue(value) {
    if (typeof value === 'function') {
      this.#rejectValue = value
    } else {
      strSetter('reject-value')(this, value)
    }
  }

  get promise() {
    return this.#promise
  }

  cancel() {
    if (!this.open) return
    const cancelValue =
      typeof this.rejectValue === 'function' ? this.rejectValue() : this.rejectValue ?? new Error('cancel')

    let maybePromise
    if (typeof this.onCancel === 'function') {
      maybePromise = this.onCancel(cancelValue)
    }

    if (maybePromise instanceof Promise) {
      if (this.$cancel) this.$cancel.loading = true
      if (this.$confirm) this.$confirm.disabled = true
      maybePromise
        .then(() => {
          if (this.#reject) {
            this.#reject(cancelValue)
          }
          this.open = false
        })
        .finally(() => {
          if (this.$cancel) this.$cancel.loading = false
          if (this.$confirm) this.$confirm.disabled = false
        })
    } else {
      if (this.#reject) {
        this.#reject(cancelValue)
      }
      this.open = false
    }
  }

  confirm() {
    if (!this.open) return
    const confirmValue = typeof this.resolveValue === 'function' ? this.resolveValue() : this.resolveValue ?? ''

    let maybePromise
    if (typeof this.onConfirm === 'function') {
      maybePromise = this.onConfirm(confirmValue)
    }

    if (maybePromise instanceof Promise) {
      if (this.$confirm) this.$confirm.loading = true
      if (this.$cancel) this.$cancel.disabled = true
      maybePromise
        .then(() => {
          if (this.#resolve) {
            this.#resolve(confirmValue)
          }
          this.open = false
        })
        .finally(() => {
          if (this.$confirm) this.$confirm.loading = false
          if (this.$cancel) this.$cancel.disabled = false
        })
    } else {
      if (this.#resolve) {
        this.#resolve(confirmValue)
      }
      this.open = false
    }
  }

  #setupDialog() {
    this.hook.onConnected(() => {
      this.autofocus = true
      this.capturefocus = true
      this.mask = true
    })
  }

  #setupConfirm() {
    const update = () => {
      if (this.withConfirm) {
        if (!this.$confirm) {
          const $confirmButton = confirmButtonTemplate()
          $confirmButton.textContent = this.confirmText ?? '确定'
          $confirmButton.onclick = this.confirm.bind(this)
          append($confirmButton, this)
        }
      } else {
        if (this.$confirm) {
          unmount(this.$confirm)
        }
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['with-confirm', 'confirm-text'], update)
  }

  #setupCancel() {
    const update = () => {
      if (this.withCancel) {
        if (!this.$cancel) {
          const $cancelButton = cancelButtonTemplate()
          $cancelButton.textContent = this.cancelText ?? '取消'
          $cancelButton.onclick = this.cancel.bind(this)
          prepend($cancelButton, this)
        }
      } else {
        if (this.$cancel) {
          unmount(this.$cancel)
        }
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['with-cancel', 'cancel-text'], update)
  }

  #setupContent() {
    const update = () => {
      if (this.content) {
        if (!this.$content) {
          const $content = contentTemplate()
          append($content, this)
        } else {
          this.$content.innerHTML = ''
        }

        // 内容是否富文本
        if (this.rich) {
          const $rich = document.createElement('div')
          $rich.innerHTML = this.content
          append($rich, this.$content!)
        } else {
          append(document.createTextNode(this.content), this.$content!)
        }
      } else {
        if (this.$content) {
          unmount(this.$content)
        }
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['content', 'rich'], update)
  }

  #setupKeymap() {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.target === this && this.withConfirm) {
        if (e.key === 'Enter') {
          this.confirm()
        } else if (e.key === 'Escape' && this.withCancel) {
          this.cancel()
        }
      }
    }
    this.hook.onConnected(() => {
      this.addEventListener('keydown', onKeydown)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('keydown', onKeydown)
    })
  }

  #setupPromise() {
    this.hook.onAttributeChangedDep('open', () => {
      if (this.open) {
        this.#promise = new Promise((resolve, reject) => {
          this.#resolve = resolve
          this.#reject = reject
        })
        this.#promise.catch(() => {
          // noop
        })
      } else {
        this.#promise = undefined
        this.#resolve = undefined
        this.#reject = undefined
      }
    })
  }
}
