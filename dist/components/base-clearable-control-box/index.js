import { clearableGetter, clearableSetter, } from '../../common/propertyAccessor.js';
import { ControlBox } from '../base-control-box/index.js';
import { clearTemplate, styleTemplate } from './template.js';
import { dispatchEvent } from '../../common/event.js';
import { unmount } from '../../common/mount.js';
export class ClearableControlBox extends ControlBox {
    static get observedAttributes() {
        return super.observedAttributes.concat(['clearable']);
    }
    constructor() {
        super();
        this._appendStyle(styleTemplate());
        this._ref.$layout.addEventListener('click', e => {
            const target = e.target;
            if (this._ref.$clear && this._ref.$clear.contains(target)) {
                dispatchEvent(this, 'click-clear');
                this._renderEmpty();
                return;
            }
        });
    }
    get clearable() {
        return clearableGetter(this);
    }
    set clearable(value) {
        clearableSetter(this, value);
    }
    _isEmpty() {
        return true;
    }
    _appendContent($el) {
        const $target = this._ref.$suffix ?? this._ref.$clear;
        if ($target) {
            this._ref.$layout.insertBefore($el, $target);
        }
        else {
            this._ref.$layout.appendChild($el);
        }
        return $el;
    }
    _renderSuffixIcon() {
        super._renderSuffixIcon();
        if (this._ref.$clear) {
            this._ref.$layout.appendChild(this._ref.$clear);
        }
    }
    _renderEmpty() {
        this._ref.$layout.classList.toggle('empty', this._isEmpty());
    }
    _renderClearable() {
        this._ref.$layout.classList.toggle('with-clear', this.clearable);
        if (this.clearable) {
            if (!this._ref.$clear) {
                const $clearButton = (this._ref.$clear = clearTemplate());
                this._ref.$layout.append($clearButton);
            }
        }
        else {
            if (this._ref.$clear) {
                unmount(this._ref.$clear);
                this._ref.$clear = undefined;
            }
        }
    }
    render() {
        super.render();
        this._renderEmpty();
        this._renderClearable();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'clearable') {
            this._renderClearable();
        }
    }
}
