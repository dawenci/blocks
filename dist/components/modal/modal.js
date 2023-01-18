import { BlocksDialog } from '../dialog/index.js';
import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { cancelButtonTemplate, confirmButtonTemplate } from './template.js';
import { append, prepend, unmount } from '../../common/mount.js';
export class BlocksModal extends BlocksDialog {
    #promise;
    #resolve;
    #reject;
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'with-cancel',
            'with-confirm',
            'cancel-text',
            'confirm-text',
            'resolve-value',
            'reject-value',
            'rich',
            'content',
        ]);
    }
    constructor() {
        super();
        this.addEventListener('keydown', e => {
            if (e.target === this && this.withConfirm) {
                if (e.key === 'Enter') {
                    this.confirm();
                }
                else if (e.key === 'Escape' && this.withCancel) {
                    this.cancel();
                }
            }
        });
    }
    get withConfirm() {
        return boolGetter('with-confirm')(this);
    }
    set withConfirm(value) {
        boolSetter('with-confirm')(this, value);
    }
    get withCancel() {
        return boolGetter('with-cancel')(this);
    }
    set withCancel(value) {
        boolSetter('with-cancel')(this, value);
    }
    get confirmText() {
        return strGetter('confirm-text')(this);
    }
    set confirmText(value) {
        strSetter('confirm-text')(this, value);
    }
    get cancelText() {
        return strGetter('cancel-text')(this);
    }
    set cancelText(value) {
        strSetter('cancel-text')(this, value);
    }
    #resolveValue;
    get resolveValue() {
        return this.#resolveValue ?? strGetter('resolve-value')(this);
    }
    set resolveValue(value) {
        if (typeof value === 'function') {
            this.#resolveValue = value;
        }
        else {
            strSetter('resolve-value')(this, value);
        }
    }
    #rejectValue;
    get rejectValue() {
        return this.#rejectValue ?? strGetter('reject-value')(this);
    }
    set rejectValue(value) {
        if (typeof value === 'function') {
            this.#rejectValue = value;
        }
        else {
            strSetter('reject-value')(this, value);
        }
    }
    get rich() {
        return boolGetter('rich')(this);
    }
    set rich(value) {
        boolSetter('rich')(this, value);
    }
    get content() {
        return strGetter('content')(this);
    }
    set content(value) {
        strSetter('content')(this, value);
    }
    get promise() {
        return this.#promise;
    }
    cancel() {
        const cancelValue = typeof this.rejectValue === 'function'
            ? this.rejectValue()
            : this.rejectValue ?? new Error('cancel');
        if (this.onCancel) {
            this.onCancel(cancelValue);
        }
        if (this.#reject) {
            this.#reject(cancelValue);
        }
        this.open = false;
    }
    confirm() {
        const confirmValue = typeof this.resolveValue === 'function'
            ? this.resolveValue()
            : this.resolveValue ?? '';
        if (this.onConfirm) {
            this.onConfirm(confirmValue);
        }
        if (this.#resolve) {
            this.#resolve(confirmValue);
        }
        this.open = false;
    }
    _renderContent() {
        if (this.content) {
            if (!this._ref.$content) {
                this._ref.$content = document.createElement('div');
                this._ref.$content.style.cssText = `min-width:200px;padding:20px 0;`;
                this.appendChild(this._ref.$content);
            }
            else {
                this._ref.$content.innerHTML = '';
            }
            if (this.rich) {
                const node = document.createElement('div');
                node.innerHTML = this.content;
                this._ref.$content.appendChild(node);
            }
            else {
                this._ref.$content.appendChild(document.createTextNode(this.content));
            }
        }
        else {
            if (this._ref.$content) {
                unmount(this._ref.$content);
                this._ref.$content = undefined;
            }
        }
    }
    _renderCancel() {
        if (this.withCancel) {
            if (!this._ref.$cancelButton) {
                this._ref.$cancelButton = cancelButtonTemplate();
                this._ref.$cancelButton.textContent = this.cancelText ?? '取消';
                prepend(this._ref.$cancelButton, this);
                this._ref.$cancelButton.onclick = this.cancel.bind(this);
            }
        }
        else {
            if (this._ref.$cancelButton) {
                unmount(this._ref.$cancelButton);
                this._ref.$cancelButton = undefined;
            }
        }
    }
    _renderConfirm() {
        if (this.withConfirm) {
            if (!this._ref.$confirmButton) {
                this._ref.$confirmButton = confirmButtonTemplate();
                this._ref.$confirmButton.textContent = this.confirmText ?? '确定';
                append(this._ref.$confirmButton, this);
                this._ref.$confirmButton.onclick = this.confirm.bind(this);
            }
        }
        else {
            if (this._ref.$confirmButton) {
                unmount(this._ref.$confirmButton);
                this._ref.$confirmButton = undefined;
            }
        }
    }
    render() {
        super.render();
        this._renderContent();
        this._renderCancel();
        this._renderConfirm();
    }
    connectedCallback() {
        super.connectedCallback();
        this.mask = true;
        this.capturefocus = true;
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'open') {
            if (this.open) {
                this.#promise = new Promise((resolve, reject) => {
                    this.#resolve = resolve;
                    this.#reject = reject;
                });
                this.#promise.catch(() => {
                });
            }
            else {
                this.#promise = undefined;
                this.#resolve = undefined;
                this.#reject = undefined;
            }
        }
        this.render();
    }
}
if (!customElements.get('bl-modal')) {
    customElements.define('bl-modal', BlocksModal);
}
