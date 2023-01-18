import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js';
import { dispatchEvent } from '../../common/event.js';
import { Control } from '../base-control/index.js';
import { loadingTemplate, prefixTemplate, styleTemplate, suffixTemplate, } from './template.js';
import { append, mountAfter, mountBefore, prepend, unmount, } from '../../common/mount.js';
export class ControlBox extends Control {
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'loading',
            'prefix-icon',
            'suffix-icon',
        ]);
    }
    constructor() {
        super();
        this._appendStyle(styleTemplate());
        this._ref.$layout.addEventListener('click', e => {
            const target = e.target;
            if (this._ref.$prefix && this._ref.$prefix.contains(target)) {
                dispatchEvent(this, 'click-prefix-icon');
                return;
            }
            if (this._ref.$suffix && this._ref.$suffix.contains(target)) {
                dispatchEvent(this, 'click-suffix-icon');
                return;
            }
        });
    }
    get loading() {
        return boolGetter('loading')(this);
    }
    set loading(value) {
        boolSetter('loading')(this, value);
    }
    get prefixIcon() {
        return strGetter('prefix-icon')(this);
    }
    set prefixIcon(value) {
        strSetter('prefix-icon')(this, value);
    }
    get suffixIcon() {
        return strGetter('suffix-icon')(this);
    }
    set suffixIcon(value) {
        strSetter('suffix-icon')(this, value);
    }
    _appendContent($el) {
        const $suffix = this._ref.$suffix;
        if ($suffix) {
            mountBefore($el, $suffix);
        }
        else {
            append($el, this._ref.$layout);
        }
        return $el;
    }
    _renderLoading() {
        this._ref.$layout.classList.toggle('with-loading', this.loading);
        if (this.loading) {
            if (!this._ref.$loading) {
                const $loading = (this._ref.$loading = loadingTemplate());
                $loading.appendChild(getRegisteredSvgIcon('loading'));
                prepend($loading, this._ref.$layout);
            }
        }
        else {
            if (this._ref.$loading) {
                unmount(this._ref.$loading);
                this._ref.$loading = undefined;
            }
        }
    }
    _renderPrefixIcon() {
        const $prefixIcon = this.prefixIcon
            ? getRegisteredSvgIcon(this.prefixIcon) ?? parseSvg(this.prefixIcon)
            : null;
        this._ref.$layout.classList.toggle('with-prefix', !!$prefixIcon);
        if ($prefixIcon) {
            const $prefix = (this._ref.$prefix =
                this._ref.$prefix ?? prefixTemplate());
            $prefix.innerHTML = '';
            $prefix.appendChild($prefixIcon);
            if (this._ref.$loading) {
                mountAfter($prefix, this._ref.$loading);
            }
            else {
                prepend($prefix, this._ref.$layout);
            }
        }
        else {
            if (this._ref.$prefix) {
                unmount(this._ref.$prefix);
                this._ref.$prefix = undefined;
            }
        }
    }
    _renderSuffixIcon() {
        const $suffixIcon = this.suffixIcon
            ? getRegisteredSvgIcon(this.suffixIcon) ?? parseSvg(this.suffixIcon)
            : null;
        this._ref.$layout.classList.toggle('with-suffix', !!$suffixIcon);
        if ($suffixIcon) {
            const $suffix = (this._ref.$suffix =
                this._ref.$suffix ?? suffixTemplate());
            $suffix.innerHTML = '';
            $suffix.appendChild($suffixIcon);
            append($suffix, this._ref.$layout);
        }
        else {
            if (this._ref.$suffix) {
                unmount(this._ref.$suffix);
                this._ref.$suffix = undefined;
            }
        }
    }
    render() {
        super.render();
        this._renderDisabled();
        this._renderPrefixIcon();
        this._renderSuffixIcon();
        this._renderLoading();
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        switch (attrName) {
            case 'disabled': {
                this._renderDisabled();
                break;
            }
            case 'loading': {
                this._renderLoading();
                break;
            }
            case 'prefix-icon': {
                this._renderPrefixIcon();
                break;
            }
            case 'suffix-icon': {
                this._renderSuffixIcon();
                break;
            }
            default: {
                break;
            }
        }
    }
}
