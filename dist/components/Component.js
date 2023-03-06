import { append, mountAfter, mountBefore, prepend, unmount, } from '../common/mount.js';
import { upgradeProperty } from '../common/upgradeProperty.js';
export class Component extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        const ctor = this.constructor;
        if (ctor._shadowRootInit) {
            this.attachShadow(ctor._shadowRootInit);
        }
        if (ctor._styleChain && this.shadowRoot) {
            const $lastStyle = this._$lastStyle ??
                getLastItem(this.shadowRoot.children.length
                    ? this.shadowRoot.querySelectorAll('style')
                    : []);
            this._$lastStyle = applyStyleChain(this, ctor._styleChain, this.shadowRoot, $lastStyle);
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
function getLastItem(arrayLike) {
    return arrayLike[arrayLike.length - 1];
}
function applyStyleChain(element, chain, shadowRoot, $lastStyle = null) {
    if (chain.parent) {
        $lastStyle = applyStyleChain(element, chain.parent, shadowRoot, $lastStyle);
    }
    const $style = chain.$style.cloneNode(true);
    if ($lastStyle) {
        mountAfter($style, $lastStyle);
    }
    else {
        prepend($style, shadowRoot);
    }
    return $style;
}
