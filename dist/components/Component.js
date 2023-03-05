import { append, mountAfter, mountBefore, prepend, unmount, } from '../common/mount.js';
import { upgradeProperty } from '../common/upgradeProperty.js';
export class Component extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        const ctor = this.constructor;
        if (ctor.hasOwnProperty('_shadowRootInit')) {
            this.attachShadow(ctor._shadowRootInit);
        }
        if (ctor.hasOwnProperty('_$style') && this.shadowRoot) {
            const $style = ctor._$style.cloneNode(true);
            const $lastStyle = this._$lastStyle;
            if ($lastStyle) {
                mountAfter($style, this._$lastStyle);
            }
            else {
                const styles = this.shadowRoot.children.length
                    ? this.shadowRoot.querySelectorAll('style')
                    : [];
                if (styles.length) {
                    mountAfter($style, styles[styles.length - 1]);
                }
                else {
                    prepend($style, this.shadowRoot);
                }
            }
        }
    }
    connectedCallback() {
        this.initRole();
        this.upgradeProperty();
    }
    disconnectedCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
    }
    render() {
    }
    prependTo($parent) {
        prepend(this, $parent);
    }
    appendTo($parent) {
        append(this, $parent);
    }
    mountBefore($sibling) {
        mountBefore(this, $sibling);
    }
    mountAfter($sibling) {
        mountAfter(this, $sibling);
    }
    unmount() {
        unmount(this);
    }
    appendShadowChildren(nodes) {
        if (this.shadowRoot) {
            for (let i = 0; i < nodes.length; i += 1) {
                this.shadowRoot.appendChild(nodes[i]);
            }
        }
    }
    appendChildren(nodes) {
        for (let i = 0; i < nodes.length; i += 1) {
            this.appendChild(nodes[i]);
        }
    }
    upgradeProperty(props) {
        if (!props) {
            props = this.constructor.upgradeProperties ?? [];
        }
        props.forEach(attr => {
            upgradeProperty(this, attr);
        });
    }
    initRole() {
        const role = this.constructor.role;
        if (role) {
            this.setAttribute('role', role);
        }
    }
    querySelectorHost(selector) {
        return this.querySelector(selector);
    }
    querySelectorShadow(selector) {
        return this.shadowRoot?.querySelector?.(selector) ?? null;
    }
    querySelectorAllHost(selector) {
        return this.querySelectorAll(selector);
    }
    querySelectorAllShadow(selector) {
        return this.shadowRoot?.querySelectorAll?.(selector) ?? null;
    }
}
