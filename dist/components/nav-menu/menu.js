import { Component } from '../Component.js';
import { boolGetter, boolSetter, intGetter, intSetter, numGetter, numSetter, } from '../../common/property.js';
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { forEach } from '../../common/utils.js';
import { styleTemplate, contentTemplate, groupTemplate, itemTemplate, } from './menu-template.js';
export class BlocksNavMenu extends Component {
    static get role() {
        return 'navigation';
    }
    _data;
    $parentMenu;
    $parentItem;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(styleTemplate());
        shadowRoot.appendChild(contentTemplate());
        this._data = [];
        this.addEventListener('active', (e) => {
            this.clearActive();
            let $item = e.detail.$item;
            while ($item) {
                $item.data.active = true;
                $item.active = true;
                $item = $item.$hostMenu.$parentItem;
            }
        });
    }
    get enterDelay() {
        return numGetter('enter-delay')(this) ?? 150;
    }
    set enterDelay(value) {
        numSetter('enter-delay')(this, value);
    }
    get leaveDelay() {
        return numGetter('leave-delay')(this) ?? 200;
    }
    set leaveDelay(value) {
        numSetter('leave-delay')(this, value);
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
    get level() {
        return intGetter('level')(this) ?? 0;
    }
    set level(value) {
        intSetter('level')(this, value);
    }
    get submenu() {
        return boolGetter('submenu')(this);
    }
    set submenu(value) {
        boolSetter('submenu')(this, value);
    }
    get expand() {
        return boolGetter('expand')(this);
    }
    set expand(value) {
        boolSetter('expand')(this, value);
    }
    get inline() {
        return boolGetter('inline')(this);
    }
    set inline(value) {
        boolSetter('inline')(this, value);
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
        return this._data;
    }
    set data(value) {
        this._data = value;
        this.render();
    }
    clearEnterTimer() {
    }
    clearLeaveTimer() {
    }
    clearActive() {
        forEach(this.children, (child) => {
            if (child.clearActive)
                child.clearActive();
        });
    }
    horizontalRender() {
        const fragment = document.createDocumentFragment();
        const render = ($root, data = []) => {
            data.forEach(item => {
                if (item.data) {
                    render($root, item.data);
                    return;
                }
                const $item = itemTemplate();
                $item.$hostMenu = this;
                $root.appendChild($item);
                $item.data = item;
            });
        };
        render(fragment, this.data);
        this.innerHTML = '';
        this.appendChild(fragment);
    }
    verticalRender() {
        const fragment = document.createDocumentFragment();
        const render = ($root, data = []) => {
            data.forEach(item => {
                if (isGroup(item)) {
                    if (this.collapse) {
                        render($root, item.data);
                    }
                    else {
                        const $group = groupTemplate();
                        $group.$hostMenu = this;
                        $group.horizontal = this.horizontal;
                        $group.collapse = this.collapse;
                        $root.appendChild($group);
                        $group.data = item;
                    }
                }
                else {
                    const $item = itemTemplate();
                    $item.$hostMenu = this;
                    $root.appendChild($item);
                    $item.data = item;
                }
            });
        };
        render(fragment, this.data);
        this.innerHTML = '';
        this.appendChild(fragment);
    }
    render() {
        if (this.horizontal) {
            this.horizontalRender();
        }
        else {
            this.verticalRender();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
    static get observedAttributes() {
        return [
            'horizontal',
            'collapse',
            'inline',
            'submenu',
            'level',
            'expand',
            'size',
            'enter-delay',
            'leave-delay',
        ];
    }
}
if (!customElements.get('bl-nav-menu')) {
    customElements.define('bl-nav-menu', BlocksNavMenu);
}
function isGroup(data) {
    return Array.isArray(data.data);
}
