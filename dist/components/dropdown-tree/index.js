import { connectSelectable, } from '../../common/connectSelectable.js';
import { dispatchEvent } from '../../common/event.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { boolGetter, boolSetter, enumGetter, enumSetter, strGetter, strSetter, } from '../../common/property.js';
import { Component } from '../Component.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { BlocksTree } from '../tree/index.js';
import { treeTemplate, popupTemplate, styleTemplate } from './template.js';
const originGetter = enumGetter('origin', Object.values(PopupOrigin));
const originSetter = enumSetter('origin', Object.values(PopupOrigin));
const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click']);
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click']);
const ATTRS = BlocksPopup.observedAttributes.concat(BlocksTree.observedAttributes);
export class BlocksDropdownTree extends Component {
    static get observedAttributes() {
        return ATTRS;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const $slot = shadowRoot.appendChild(document.createElement('slot'));
        const $popup = popupTemplate();
        const $tree = treeTemplate();
        $popup.appendChildren([styleTemplate(), $tree]);
        this._ref = {
            $slot,
            $popup,
            $tree,
        };
        const defaultAnchorGetter = () => $slot.assignedElements()?.[0] ?? this;
        this.setAnchorGetter(defaultAnchorGetter);
        $popup.anchor = () => (this.getAnchorGetter() ?? defaultAnchorGetter)();
        connectSelectable(this, $tree);
        this.addEventListener('focus', () => {
            this.openPopup();
        }, true);
        this.addEventListener('click', () => {
            this.openPopup();
        });
        const onEnter = () => {
            if (this.triggerMode === 'hover') {
                this.openPopup();
            }
        };
        const onLeave = () => {
            if (this.triggerMode === 'hover') {
                clearTimeout(this._hideTimer);
                this._hideTimer = setTimeout(() => {
                    this.closePopup();
                }, 200);
            }
        };
        this.addEventListener('mouseenter', onEnter);
        $popup.addEventListener('mouseenter', onEnter);
        this.addEventListener('mouseleave', onLeave);
        $popup.addEventListener('mouseleave', onLeave);
        $popup.addEventListener('opened', () => {
            this.#initClickOutside();
            this.redrawList();
        });
        $popup.addEventListener('closed', () => {
            this.#destroyClickOutside();
        });
        $tree.addEventListener('click-item', (event) => {
            dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } });
        });
    }
    _findResultComponent() {
        const canAcceptValue = ($el) => {
            return (typeof $el.acceptSelected === 'function' ||
                (typeof $el.select === 'function' &&
                    typeof $el.deselect === 'function'));
        };
        return this._ref.$slot.assignedElements().find(canAcceptValue);
    }
    acceptSelected(value) {
        const $result = this._findResultComponent();
        if ($result && $result.acceptSelected) {
            $result.acceptSelected(value);
        }
    }
    select(data) {
        const $result = this._findResultComponent();
        if ($result && $result.select) {
            $result.select(data);
        }
    }
    deselect(data) {
        const $result = this._findResultComponent();
        if ($result && $result.deselect) {
            $result.deselect(data);
        }
    }
    get triggerMode() {
        return triggerModeGetter(this) ?? 'click';
    }
    set triggerMode(value) {
        triggerModeSetter(this, value);
    }
    get open() {
        return boolGetter('open')(this);
    }
    set open(value) {
        boolSetter('open')(this, value);
    }
    get origin() {
        return originGetter(this);
    }
    set origin(value) {
        originSetter(this, value);
    }
    get data() {
        return this._ref.$tree.data;
    }
    set data(value) {
        this._ref.$tree.data = value;
    }
    get checked() {
        return this._ref.$tree.checked;
    }
    set checked(ids) {
        this._ref.$tree.checked = ids;
    }
    get checkedData() {
        return this._ref.$tree.checkedData;
    }
    set checkedData(value) {
        this._ref.$tree.checkedData = value;
    }
    get disabledField() {
        return this.getAttribute('disabled-field') ?? 'disabled';
    }
    set disabledField(value) {
        this.setAttribute('disabled-field', value);
    }
    get idField() {
        return this.getAttribute('id-field') || 'id';
    }
    set idField(value) {
        this.setAttribute('id-field', value);
    }
    get labelField() {
        return strGetter('label-field')(this);
    }
    set labelField(value) {
        strSetter('label-field')(this, value);
    }
    get checkable() {
        return boolGetter('checkable')(this);
    }
    set checkable(value) {
        boolSetter('checkable')(this, value);
    }
    get multiple() {
        return boolGetter('multiple')(this);
    }
    set multiple(value) {
        boolSetter('multiple')(this, value);
    }
    #anchorGetter;
    getAnchorGetter() {
        return this.#anchorGetter;
    }
    setAnchorGetter(value) {
        this.#anchorGetter = value;
    }
    openPopup() {
        clearTimeout(this._hideTimer);
        this.open = true;
    }
    closePopup() {
        clearTimeout(this._hideTimer);
        this.open = false;
    }
    redrawList() {
        this._ref.$tree.redraw();
    }
    connectedCallback() {
        super.connectedCallback();
        if (!document.body.contains(this._ref.$popup)) {
            this._ref.$popup.appendTo(document.body);
        }
        if (!this.hasAttribute('origin')) {
            this.origin = PopupOrigin.TopStart;
        }
        this.render();
    }
    disconnectedCallback() {
        document.body.removeChild(this._ref.$popup);
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (BlocksPopup.observedAttributes.includes(attrName)) {
            if (attrName === 'open') {
                this._ref.$popup.open = this.open;
            }
            else {
                this._ref.$popup.setAttribute(attrName, newValue);
            }
        }
        if (BlocksTree.observedAttributes.includes(attrName)) {
            this._ref.$tree.setAttribute(attrName, newValue);
        }
        if (attrName === 'open' && this.open) {
            this.redrawList();
        }
    }
    #clearClickOutside;
    #initClickOutside() {
        if (!this.#clearClickOutside) {
            this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
                this.open = false;
            });
        }
    }
    #destroyClickOutside() {
        if (this.#clearClickOutside) {
            this.#clearClickOutside();
            this.#clearClickOutside = undefined;
        }
    }
}
if (!customElements.get('bl-dropdown-tree')) {
    customElements.define('bl-dropdown-tree', BlocksDropdownTree);
}
