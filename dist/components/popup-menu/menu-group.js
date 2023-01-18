import { strGetter, strSetter } from '../../common/property.js';
import { forEach } from '../../common/utils.js';
import { Component } from '../Component.js';
import { styleTemplate, contentTemplate, itemTemplate, } from './menu-group-template.js';
export class BlocksPopupMenuGroup extends Component {
    static get observedAttributes() {
        return ['title'];
    }
    _data;
    $head;
    $body;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(styleTemplate());
        shadowRoot.appendChild(contentTemplate());
        this.$head = shadowRoot.getElementById('head');
        this.$body = shadowRoot.getElementById('body');
    }
    #hostMenu;
    get $hostMenu() {
        return this.#hostMenu;
    }
    set $hostMenu($menu) {
        this.#hostMenu = $menu;
    }
    get titleText() {
        return strGetter('title')(this) ?? '';
    }
    set titleText(value) {
        strSetter('title')(this, value);
    }
    get data() {
        return this._data ?? {};
    }
    set data(value) {
        this._data = value;
        this.render();
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
    render() {
        const data = this.data;
        if (data.title) {
            this.$head.textContent = data.title;
            this.$head.style.display = 'block';
        }
        else {
            this.$head.style.display = 'none';
        }
        const bodyFragment = document.createDocumentFragment();
        (this.data.data ?? []).forEach(item => {
            if (!item.label && item.data) {
                console.warn('Nested grouping is not supported.');
                return;
            }
            const $item = itemTemplate();
            $item.$hostMenu = this.$hostMenu;
            bodyFragment.appendChild($item);
            $item.data = item;
        });
        this.$body.innerHTML = '';
        this.$body.appendChild(bodyFragment);
    }
    clearActive() {
        const children = this.$body.children;
        forEach(children, child => {
            if (child.clearActive)
                child.clearActive();
        });
    }
}
if (!customElements.get('bl-popup-menu-group')) {
    customElements.define('bl-popup-menu-group', BlocksPopupMenuGroup);
}
