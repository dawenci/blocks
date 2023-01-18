import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksIntersection extends Component {
    static get observedAttributes() {
        return ['root', 'root-margin', 'threshold'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
    }
    _root;
    get root() {
        if (this._root) {
            return this._root() ?? null;
        }
        return this.getAttribute('root');
    }
    set root(value) {
        if (typeof value === 'string' || value === null) {
            this.setAttribute('root', value);
            this._root = undefined;
            return;
        }
        if (typeof value === 'function') {
            this._root = value;
        }
        else if (value instanceof Node) {
            this._root = () => value;
        }
        this.removeAttribute('root');
    }
    get rootElement() {
        let root = this.root;
        if (root instanceof Element) {
            if (root.contains(this))
                return root;
            root = null;
        }
        if (typeof root === 'string') {
            try {
                root = document.querySelector(root);
                if (!root.contains(this))
                    root = null;
            }
            catch (error) {
                root = null;
            }
        }
        return root ?? undefined;
    }
    get rootMargin() {
        return this.getAttribute('root-margin') ?? '0px';
    }
    set rootMargin(value) {
        this.setAttribute('root-margin', value);
    }
    get threshold() {
        return this.getAttribute('threshold') ?? '0';
    }
    set threshold(value) {
        this.setAttribute('threshold', value);
    }
    _flag;
    _observer;
    _initObserver() {
        if (!this._flag) {
            this._flag = Promise.resolve().then(() => {
                if (this._observer) {
                    this._observer.disconnect();
                }
                this._observer = new IntersectionObserver((entries, observer) => {
                    dispatchEvent(this, 'intersection', {
                        detail: {
                            entries,
                            observer,
                        },
                    });
                }, {
                    root: this.rootElement,
                    rootMargin: this.rootMargin,
                    threshold: +this.threshold,
                });
                this._observer.observe(this);
                this._flag = null;
            });
        }
    }
    _removeObserver() {
        if (this._observer) {
            this._observer.disconnect();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
        this._initObserver();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeObserver();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this._initObserver();
    }
}
if (!customElements.get('bl-intersection')) {
    customElements.define('bl-intersection', BlocksIntersection);
}
