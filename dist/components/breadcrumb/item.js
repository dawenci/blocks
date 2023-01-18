import { strGetter, strSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './item-template.js';
export class BlocksBreadcrumbItem extends Component {
    ref;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this.ref = {
            $link: shadowRoot.getElementById('link'),
            $separator: shadowRoot.getElementById('separator'),
        };
    }
    get href() {
        return strGetter('href')(this) ?? 'javascript(void 0)';
    }
    set href(value) {
        strSetter('href')(this, value);
    }
    renderSeparator(separator) {
        if (this.parentElement?.lastElementChild === this)
            return;
        this.ref.$separator.textContent = separator;
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'href') {
            strSetter('href')(this, this.href || null);
        }
    }
    static get observedAttributes() {
        return ['href'];
    }
}
if (!customElements.get('bl-breadcrumb-item')) {
    customElements.define('bl-breadcrumb-item', BlocksBreadcrumbItem);
}
