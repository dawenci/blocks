import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { forEach } from '../../common/utils.js';
import { Component } from '../Component.js';
import { styleTemplate, contentTemplate, itemTemplate, } from './menu-group-template.js';
import './menu-item.js';
export class BlocksNavMenuGroup extends Component {
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
    get horizontal() {
        return boolGetter('horizontal')(this);
    }
    set horizontal(value) {
        boolSetter('horizontal')(this, value);
    }
    get collapse() {
        return boolGetter('collapse')(this);
    }
    set collapse(value) {
        boolSetter('collapse')(this, value);
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
        (this.data.data ?? []).forEach((item) => {
            if (!item.label && item.data)
                return;
            const $item = itemTemplate();
            $item.$hostMenu = this.$hostMenu;
            bodyFragment.appendChild($item);
            $item.data = item;
        });
        this.$body.innerHTML = '';
        this.$body.appendChild(bodyFragment);
    }
    clearActive() {
        forEach(this.$body.children, (child) => {
            if (child.clearActive)
                child.clearActive();
        });
    }
    static get observedAttributes() {
        return ['title', 'horizontal', 'collapse'];
    }
}
if (!customElements.get('bl-nav-menu-group')) {
    customElements.define('bl-nav-menu-group', BlocksNavMenuGroup);
}
