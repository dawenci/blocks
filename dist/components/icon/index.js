import { strGetter, strSetter } from '../../common/property.js';
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksIcon extends Component {
    ref;
    static get observedAttributes() {
        return ['value', 'fill'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const fragment = template().content.cloneNode(true);
        const $layout = fragment.querySelector('#layout');
        shadowRoot.appendChild(fragment);
        this.ref = {
            $layout,
        };
    }
    render() {
        const { $layout } = this.ref;
        if ($layout.firstElementChild) {
            $layout.removeChild($layout.firstElementChild);
        }
        const attrs = {};
        if (this.fill) {
            attrs.fill = this.fill;
        }
        const icon = getRegisteredSvgIcon(this.value ?? '', attrs) ??
            parseSvg(this.value ?? '', attrs);
        if (icon) {
            $layout.appendChild(icon);
        }
    }
    get value() {
        return strGetter('value')(this);
    }
    set value(value) {
        strSetter('value')(this, value);
    }
    get fill() {
        return strGetter('fill')(this);
    }
    set fill(value) {
        strSetter('fill')(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
}
if (!customElements.get('bl-icon')) {
    customElements.define('bl-icon', BlocksIcon);
}
