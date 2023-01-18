import '../tag/index.js';
import { boolGetter, boolSetter, intGetter, intSetter, strGetter, strSetter, } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { contentTemplate, moreTemplate, placeholderTemplate, searchTemplate, styleTemplate, tagTemplate, valueTextTemplate, } from './template.js';
import { append, mountAfter, mountBefore, unmount } from '../../common/mount.js';
import { ClearableControlBox, } from '../base-clearable-control-box/index.js';
export class BlocksSelectResult extends ClearableControlBox {
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'clearable',
            'max-tag-count',
            'multiple',
            'placeholder',
            'prefix-icon',
            'searchable',
            'size',
            'suffix-icon',
        ]);
    }
    constructor() {
        super();
        this._appendStyle(styleTemplate());
        this._ref.$content = this._appendContent(contentTemplate());
        this._ref.$layout.oninput = e => {
            const searchString = e.target.value;
            this.#notifySearch(searchString);
        };
        this.addEventListener('click-clear', () => {
            this.#notifyClear();
        });
        this._ref.$layout.onclose = e => {
            const $tag = e.target;
            const label = $tag.textContent ?? '';
            const value = $tag.dataset.value;
            this.deselect({ value, label });
        };
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
        this.render();
    }
    get multiple() {
        return boolGetter('multiple')(this);
    }
    set multiple(value) {
        boolSetter('multiple')(this, value);
    }
    get maxTagCount() {
        return intGetter('max-tag-count')(this) ?? Infinity;
    }
    set maxTagCount(value) {
        intSetter('max-tag-count')(this, value);
    }
    get searchable() {
        return boolGetter('searchable')(this);
    }
    set searchable(value) {
        boolSetter('searchable')(this, value);
    }
    get placeholder() {
        return strGetter('placeholder')(this);
    }
    set placeholder(value) {
        strSetter('placeholder')(this, value);
    }
    #formatter;
    get formatter() {
        if (this.#formatter) {
            return this.#formatter;
        }
        return (item) => item?.label ?? '';
    }
    set formatter(value) {
        if (typeof value === 'function') {
            this.#formatter = value;
        }
        this.render();
    }
    get label() {
        return this._ref.$content.textContent;
    }
    _value = null;
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this._renderValue();
    }
    #notifySearch(searchString) {
        if (this.disabled)
            return;
        dispatchEvent(this, 'select-result:search', { detail: { searchString } });
    }
    #notifyClear() {
        if (this.disabled)
            return;
        dispatchEvent(this, 'select-result:clear');
    }
    #notifyDeselect(selected) {
        if (this.disabled)
            return;
        dispatchEvent(this, 'select-result:deselect', {
            detail: { value: selected },
        });
    }
    acceptSelected(value) {
        if (this.multiple) {
            const currentValues = this.getValues();
            const isSame = currentValues.length === value.length &&
                currentValues.every((item, index) => item.value === value[index].value &&
                    item.label === value[index].label);
            if (isSame) {
                return;
            }
            this.value = value.slice();
        }
        else {
            if (value.length === 0) {
                this.value = null;
            }
            else {
                this.value = value[0];
            }
        }
    }
    select(selected) {
        if (!this.multiple) {
            this.acceptSelected([selected]);
        }
        else {
            const values = this.getValues().filter(item => item.value !== selected.value);
            values.push(selected);
            this.acceptSelected(values);
        }
    }
    deselect(selected) {
        const values = this.getValues();
        const newValues = values.filter(item => item.value !== selected.value);
        this.acceptSelected(newValues);
        this._renderValue();
        this.#notifyDeselect(selected);
    }
    getValue() {
        if (this.value == null) {
            return null;
        }
        if (Array.isArray(this.value)) {
            return this.value[0] ?? null;
        }
        return this.value;
    }
    getValues() {
        if (this.value == null) {
            return [];
        }
        if (Array.isArray(this.value)) {
            return this.value;
        }
        return [this.value];
    }
    clearValue() {
        this._value = null;
        this._renderValue();
    }
    _isEmpty() {
        return this.multiple
            ? !this._ref.$content.querySelectorAll('bl-tag').length
            : !this._ref.$content.textContent;
    }
    clearSearch() {
        if (this._ref.$search) {
            this._ref.$search.value = '';
            this.#notifySearch('');
        }
    }
    _renderClass() {
        this._ref.$layout.classList.toggle('single', !this.multiple);
        this._ref.$layout.classList.toggle('multiple', this.multiple);
    }
    _renderPlaceholder() {
        if (this.placeholder) {
            if (!this._ref.$placeholder) {
                this._ref.$placeholder = placeholderTemplate();
                mountAfter(this._ref.$placeholder, this._ref.$content);
            }
            this._ref.$placeholder.textContent = this.placeholder;
            this._ref.$placeholder.style.left = this._ref.$content.offsetLeft + 'px';
        }
        else {
            if (this._ref.$placeholder) {
                unmount(this._ref.$placeholder);
                this._ref.$placeholder = undefined;
            }
        }
    }
    _renderSearchable() {
        this.internalTabIndex = this.searchable ? '-1' : '0';
        if (this.searchable) {
            if (!this._ref.$search) {
                const $search = searchTemplate();
                this._ref.$search = $search;
                if (this._ref.$plainTextValue) {
                    mountBefore($search, this._ref.$plainTextValue);
                }
                else {
                    append($search, this._ref.$content);
                }
            }
        }
        else {
            if (this._ref.$search) {
                unmount(this._ref.$search);
            }
        }
    }
    _renderValue() {
        this._ref.$layout.classList.toggle('empty', !this.getValues().length);
        if (!this.multiple) {
            if (!this._ref.$plainTextValue) {
                this._ref.$plainTextValue = valueTextTemplate();
                append(this._ref.$plainTextValue, this._ref.$content);
            }
            else {
                this._ref.$plainTextValue.textContent = '';
            }
            this._ref.$content.querySelectorAll('bl-tag').forEach(unmount);
        }
        else if (this._ref.$plainTextValue) {
            unmount(this._ref.$plainTextValue);
        }
        if (!this.multiple) {
            const value = this.getValue();
            this._ref.$plainTextValue.textContent = value
                ? this.formatter(value)
                : '';
            return;
        }
        const values = this.getValues();
        const tagCount = Math.min(values.length, this.maxTagCount);
        const hiddenCount = values.length - tagCount;
        const $tags = this._ref.$content.getElementsByTagName('bl-tag');
        while ($tags.length > tagCount) {
            unmount($tags[$tags.length - 1]);
        }
        while ($tags.length < tagCount) {
            const $tag = tagTemplate();
            if (this._ref.$search) {
                mountBefore($tag, this._ref.$search);
            }
            else {
                append($tag, this._ref.$content);
            }
        }
        for (let i = 0; i < tagCount; i += 1) {
            const item = values[i];
            const $tag = $tags[i];
            const label = this.formatter(item);
            const value = item.value;
            $tag.size = this.size;
            $tag.textContent = label;
            $tag.dataset.value = value;
            $tag.closeable = this.clearable;
        }
        let $more = this._ref.$content.querySelector('.more');
        if (hiddenCount > 0) {
            if (!$more) {
                $more = moreTemplate();
                $more.innerText = `+${hiddenCount}`;
                if (this._ref.$search) {
                    mountBefore($more, this._ref.$search);
                }
                else {
                    append($more, this._ref.$content);
                }
            }
            else {
                $more.innerText = `+${hiddenCount}`;
            }
        }
        else {
            if ($more) {
                unmount($more);
            }
        }
    }
    render() {
        super.render();
        this._renderClass();
        this._renderPlaceholder();
        this._renderSearchable();
        this._renderValue();
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        switch (attrName) {
            case 'max-tag-count': {
                this._renderValue();
                break;
            }
            case 'multiple': {
                this._renderClass();
                break;
            }
            case 'placeholder': {
                this._renderPlaceholder();
                break;
            }
            case 'searchable': {
                this._renderSearchable();
                break;
            }
            case 'prefix-icon':
            case 'loading': {
                this._renderPlaceholder();
            }
        }
    }
}
if (!customElements.get('bl-select-result')) {
    customElements.define('bl-select-result', BlocksSelectResult);
}
