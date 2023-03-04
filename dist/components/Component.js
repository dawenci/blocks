import { append, mountAfter, mountBefore, prepend, unmount, } from '../common/mount.js';
import { upgradeProperty } from '../common/upgradeProperty.js';
export class Component extends HTMLElement {
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
    static get observedAttributes() {
        return [];
    }
}
