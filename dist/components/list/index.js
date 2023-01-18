import { BlocksVList } from '../vlist/index.js';
import { dispatchEvent } from '../../common/event.js';
import { parseHighlight } from '../../common/highlight.js';
import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { template } from './template.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
export class BlocksList extends BlocksVList {
    #checkedSet;
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'border',
            'disabled',
            'disabled-field',
            'id-field',
            'label-field',
            'checkable',
            'multiple',
            'search',
            'stripe',
        ]);
    }
    constructor() {
        super();
        const { comTemplate } = template();
        const shadowRoot = this.shadowRoot;
        shadowRoot.insertBefore(comTemplate.content.cloneNode(true), this._ref.$viewport);
        this.#checkedSet = new Set();
        this._ref.$list.onclick = e => {
            if (this.disabled)
                return;
            let $item = e.target;
            if ($item === this._ref.$list)
                return;
            while ($item !== this._ref.$list) {
                if ($item.classList.contains('item')) {
                    break;
                }
                $item = $item.parentElement;
            }
            if ($item.hasAttribute('disabled'))
                return;
            dispatchEvent(this, 'click-item', {
                detail: {
                    id: $item.dataset.id,
                    data: this.getVirtualItemByKey($item.dataset.id)?.data,
                },
            });
            if (this.checkable) {
                this._selectItem($item);
            }
        };
        const isDisabledItem = ($item) => {
            return this.disabled || $item.hasAttribute('disabled');
        };
        captureEventWhenEnable(this, 'keydown', e => {
            const $focus = this._ref.$list.querySelector(':focus');
            if (e.key === 'ArrowDown') {
                if (!$focus)
                    return;
                e.preventDefault();
                let $next = $focus.nextElementSibling;
                while ($next && isDisabledItem($next)) {
                    $next = $next.nextElementSibling;
                }
                if ($next) {
                    ;
                    $next.focus();
                }
                else {
                    const scrollableBottom = this._ref.$viewport.getScrollableBottom();
                    const scrollDelta = Math.min(this.viewportHeight / 2, scrollableBottom);
                    this._ref.$viewport.viewportScrollTop += scrollDelta;
                }
            }
            else if (e.key === 'ArrowUp') {
                if (!$focus)
                    return;
                e.preventDefault();
                let $prev = $focus.previousElementSibling;
                while ($prev && isDisabledItem($prev)) {
                    $prev = $prev.previousElementSibling;
                }
                if ($prev) {
                    ;
                    $prev.focus();
                }
                else {
                    const scrollableTop = this._ref.$viewport.getScrollableTop();
                    const scrollDelta = Math.min(this.viewportHeight / 2, scrollableTop);
                    this._ref.$viewport.viewportScrollTop -= scrollDelta;
                }
            }
            else if (e.key === ' ' || e.key === 'Enter') {
                if (!$focus)
                    return;
                e.preventDefault();
                $focus.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));
            }
        });
    }
    get disabled() {
        return boolGetter('disabled')(this);
    }
    set disabled(value) {
        boolSetter('disabled')(this, value);
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
    get checkedData() {
        return [...(this.#checkedSet ?? [])].map((vitem) => vitem.data);
    }
    set checkedData(data) {
        this.#checkedSet = new Set(data
            .map(data => this.virtualDataMap[this.keyMethod(data)])
            .filter(vitem => !!vitem));
        this.render();
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: this.checkedData.map(data => ({
                    label: this.internalLabelMethod(data),
                    value: this.keyMethod(data),
                })),
            },
        });
    }
    get checked() {
        return this.checkedData.map(this.keyMethod.bind(this));
    }
    set checked(ids) {
        const vitems = ids
            .map(id => this.getVirtualItemByKey(id))
            .filter(vitem => !!vitem);
        this.#checkedSet = new Set(vitems);
        this.render();
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: this.checkedData.map(data => ({
                    label: this.internalLabelMethod(data),
                    value: this.keyMethod(data),
                })),
            },
        });
    }
    get search() {
        return strGetter('search')(this);
    }
    set search(value) {
        strSetter('search')(this, value);
    }
    select(data) {
        const vitem = this.virtualDataMap[data.value];
        if (!vitem)
            return;
        if (this.#checkedSet.has(vitem))
            return;
        if (this.multiple) {
            this.#checkedSet.add(vitem);
        }
        else {
            this.#checkedSet = new Set([vitem]);
        }
        this.render();
        dispatchEvent(this, 'select-list:select', { detail: { value: data } });
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: this.checkedData.map(data => ({
                    label: this.internalLabelMethod(data),
                    value: this.keyMethod(data),
                })),
            },
        });
    }
    deselect(data) {
        const vitem = this.virtualDataMap[data.value];
        if (!vitem)
            return;
        if (!this.#checkedSet.has(vitem))
            return;
        this.#checkedSet.delete(vitem);
        this.render();
        dispatchEvent(this, 'select-list:deselect', { detail: { value: data } });
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: this.checkedData.map(data => ({
                    label: this.internalLabelMethod(data),
                    value: this.keyMethod(data),
                })),
            },
        });
    }
    searchSelectable(searchString) {
        this.search = searchString;
    }
    clearSelected() {
        if (this.checkedData.length) {
            this.checkedData = [];
        }
    }
    _selectItem($item) {
        const vitem = this.virtualDataMap[$item.dataset.virtualKey];
        const label = this.internalLabelMethod(vitem.data);
        const value = this.keyMethod(vitem.data);
        if (this.multiple) {
            if (this.#checkedSet.has(vitem)) {
                this.deselect({ value, label });
            }
            else {
                this.select({ value, label });
            }
        }
        else {
            this.select({ value, label });
        }
    }
    _renderDisabled() {
        if (this.disabled) {
            this.setAttribute('aria-disabled', 'true');
        }
        else {
            this.setAttribute('aria-disabled', 'false');
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        switch (attrName) {
            case 'disabled': {
                this._renderDisabled();
                break;
            }
            case 'disabled-field': {
                this.render();
                break;
            }
            case 'search': {
                this.generateViewData();
                break;
            }
            case 'multiple': {
                if (this.checkable && !this.multiple && this.#checkedSet.size) {
                    this.#checkedSet = new Set([
                        [...this.#checkedSet][this.#checkedSet.size - 1],
                    ]);
                }
                break;
            }
            case 'id-field': {
                if (this.idField) {
                    this.keyMethod = (data) => {
                        return data[this.idField];
                    };
                }
                break;
            }
            default: {
                if (BlocksList.observedAttributes.includes(attrName)) {
                    this.render();
                }
            }
        }
    }
    internalLabelMethod(data) {
        if (typeof this.labelMethod === 'function')
            return this.labelMethod(data) ?? '';
        if (typeof this.labelField === 'string')
            return data[this.labelField] ?? '';
        return data.label ?? '';
    }
    keyMethod(data) {
        if (this.idMethod) {
            return this.idMethod(data);
        }
        return data[this.idField];
    }
    async filterMethod(data) {
        if (!this.search)
            return data;
        const len = data.length;
        const results = [];
        return new Promise(resolve => {
            setTimeout(() => {
                for (let i = 0; i < len; i += 1) {
                    const vItem = data[i];
                    if (this.internalLabelMethod(vItem.data).includes(this.search)) {
                        results.push(vItem);
                    }
                }
                resolve(results);
            });
        });
    }
    parseHighlight(label, highlightText) {
        return parseHighlight(label, highlightText);
    }
    _renderItemDisabled($item, vitem) {
        const isDisabled = (this.disabled || vitem.data[this.disabledField]) ?? false;
        if (isDisabled) {
            $item.removeAttribute('tabindex');
            $item.setAttribute('disabled', '');
        }
        else {
            $item.setAttribute('tabindex', '-1');
            $item.removeAttribute('disabled');
        }
        if (this.#checkedSet.has(vitem)) {
            $item.classList.add('checked');
        }
        else {
            $item.classList.remove('checked');
        }
    }
    itemRender($item, vitem) {
        $item.classList.add('item');
        $item.innerHTML = `<div class="prefix"></div><div class="label"></div><div class="suffix"></div>`;
        const label = this.internalLabelMethod(vitem.data) ?? '';
        if (this.search && this.search.length) {
            $item.children[1].innerHTML = this.parseHighlight(label, this.search)
                .map(textSlice => {
                return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`;
            })
                .join('');
        }
        else {
            $item.children[1].innerHTML = label;
        }
        this._renderItemDisabled($item, vitem);
    }
}
if (!customElements.get('bl-list')) {
    customElements.define('bl-list', BlocksList);
}
