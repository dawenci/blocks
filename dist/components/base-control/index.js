import { append, mountBefore } from '../../common/mount.js';
import { strSetter } from '../../common/property.js';
import { disabledGetter, disabledSetter, } from '../../common/propertyAccessor.js';
import { Component } from '../Component.js';
export class Control extends Component {
    static get observedAttributes() {
        return super.observedAttributes.concat(['disabled']);
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({
            mode: 'open',
            delegatesFocus: true,
        });
        const $layout = document.createElement('div');
        $layout.id = 'layout';
        this._ref = {
            $layout: shadowRoot.appendChild($layout),
        };
    }
    #internalTabIndex = '-1';
    get internalTabIndex() {
        return this.#internalTabIndex;
    }
    set internalTabIndex(value) {
        this.#internalTabIndex = value;
        this._renderDisabled();
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    _renderDisabled() {
        if (this.disabled || this.internalTabIndex == null) {
            this.setAttribute('aria-disabled', 'true');
            strSetter('tabindex')(this._ref.$layout, null);
        }
        else {
            strSetter('tabindex')(this._ref.$layout, this.internalTabIndex);
            this.setAttribute('aria-disabled', 'false');
        }
    }
    _appendStyle($style) {
        mountBefore($style, this._ref.$layout);
    }
    _appendContent($el) {
        append($el, this._ref.$layout);
        return $el;
    }
    render() {
        this._renderDisabled();
    }
    connectedCallback() {
        super.connectedCallback();
        this._renderDisabled();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'disabled') {
            this._renderDisabled();
        }
    }
}
