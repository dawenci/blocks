import { BlocksVList, VirtualItem } from '../vlist/index.js';
import { boolGetter, boolSetter, intGetter, intSetter, strGetter, strSetter, } from '../../common/property.js';
import { isEmpty, merge, uniqBy, flatten } from '../../common/utils.js';
import { dispatchEvent } from '../../common/event.js';
import { parseHighlight } from '../../common/highlight.js';
import { template } from './template.js';
export class VirtualNode extends VirtualItem {
    constructor(options) {
        super(options);
        this.parentKey = options.parentKey;
        this.expanded = !!options.expanded;
        this.checked = !!options.checked;
        this.indeterminate = !!options.indeterminate;
        this.parent = null;
        this.children = [];
        this._retain = false;
    }
}
export class BlocksTree extends BlocksVList {
    labelMethod;
    uniqCid;
    _checkedSet;
    #batchUpdateFold;
    #lastChecked;
    constructor() {
        super();
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(template().content.cloneNode(true));
        this.uniqCid = String(Math.random()).substr(2);
        this._checkedSet = new Set();
        this._ref.$list.onclick = this.#onClick.bind(this);
        const onBound = () => {
            this.removeEventListener('data-bound', onBound);
            if (this.defaultFoldAll) {
                this.foldAll();
            }
            if (this._checkedSet.size) {
                this._checkedSet = new Set();
            }
        };
        this.addEventListener('data-bound', onBound);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'activable',
            'active-key',
            'checkable',
            'check-on-click-node',
            'check-strictly',
            'border',
            'default-fold-all',
            'disabled',
            'expand-on-click-node',
            'id-field',
            'indent-unit',
            'label-field',
            'multiple',
            'search',
            'stripe',
            'wrap',
        ]);
    }
    get activeKey() {
        return strGetter('active-key')(this);
    }
    set activeKey(value) {
        strSetter('active-key')(this, value);
    }
    get activable() {
        return boolGetter('activable')(this);
    }
    set activable(value) {
        boolSetter('activable')(this, value);
    }
    get checkedData() {
        const data = [...this._checkedSet].map(vitem => vitem.data);
        return data;
    }
    set checkedData(value) {
        const vitems = value
            .map(data => this.virtualDataMap[this.internalKeyMethod(data)])
            .filter(vitem => !!vitem);
        this._checkedSet = new Set(vitems);
        this.render();
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: vitems.map(vitem => {
                    return {
                        label: this.internalLabelMethod(vitem.data),
                        value: this.internalKeyMethod(vitem.data),
                    };
                }),
            },
        });
    }
    get checked() {
        const list = [...this._checkedSet];
        return list.map(vitem => vitem.virtualKey);
    }
    set checked(ids) {
        const vitems = ids
            .map(id => this.virtualDataMap[id])
            .filter(vitem => !!vitem);
        this._checkedSet = new Set(vitems);
        this.render();
        dispatchEvent(this, 'select-list:change', {
            detail: {
                value: vitems.map(vitem => {
                    return {
                        label: this.internalLabelMethod(vitem.data),
                        value: this.internalKeyMethod(vitem.data),
                    };
                }),
            },
        });
    }
    get checkable() {
        return boolGetter('checkable')(this);
    }
    set checkable(value) {
        boolSetter('checkable')(this, value);
    }
    get checkOnClickNode() {
        return boolGetter('check-on-click-node')(this);
    }
    set checkOnClickNode(value) {
        boolSetter('check-on-click-node')(this, value);
    }
    get checkStrictly() {
        return boolGetter('check-strictly')(this);
    }
    set checkStrictly(value) {
        boolSetter('check-strictly')(this, value);
    }
    get defaultFoldAll() {
        return boolGetter('default-fold-all')(this);
    }
    set defaultFoldAll(value) {
        boolSetter('default-fold-all')(this, value);
    }
    get disabled() {
        return boolGetter('disabled')(this);
    }
    set disabled(value) {
        boolSetter('disabled')(this, value);
    }
    get expandOnClickNode() {
        return boolGetter('expand-on-click-node')(this);
    }
    set expandOnClickNode(value) {
        boolSetter('expand-on-click-node')(this, value);
    }
    get indentUnit() {
        return intGetter('indent-unit')(this) ?? 16;
    }
    set indentUnit(value) {
        intSetter('indent-unit')(this, value);
    }
    get idField() {
        return strGetter('id-field')(this);
    }
    set idField(value) {
        strSetter('id-field')(this, value);
    }
    get labelField() {
        return strGetter('label-field')(this);
    }
    set labelField(value) {
        strSetter('label-field')(this, value);
    }
    get search() {
        return strGetter('search')(this);
    }
    set search(value) {
        strSetter('search')(this, value);
    }
    get wrap() {
        return boolGetter('wrap')(this);
    }
    set wrap(value) {
        boolSetter('wrap')(this, value);
    }
    get multiple() {
        return boolGetter('multiple')(this);
    }
    set multiple(value) {
        boolSetter('multiple')(this, value);
    }
    select(data) {
        this.#toggleCheck(data.value, true);
    }
    deselect(data) {
        this.#toggleCheck(data.value, false);
    }
    clearSelected() {
        this.#batchToggleCheck(this.checked, false);
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'search') {
            this.generateViewData();
        }
        else if (attrName === 'wrap') {
            this._resetCalculated();
            this.redraw();
            this.restoreAnchor();
        }
    }
    internalLabelMethod(data) {
        if (typeof this.labelMethod === 'function')
            return this.labelMethod(data) ?? '';
        if (typeof this.labelField === 'string')
            return data[this.labelField] ?? '';
        return data.label ?? '';
    }
    internalKeyMethod(data) {
        if (typeof this.keyMethod === 'function')
            return this.keyMethod(data);
        if (typeof this.idField === 'string')
            return data[this.idField];
        return data.id;
    }
    filterMethod(data) {
        if (!this.search)
            return Promise.resolve(data);
        const len = data.length;
        const results = [];
        for (let i = 0; i < len; i += 1) {
            const vItem = data[i];
            if (this.internalLabelMethod(vItem.data).includes(this.search)) {
                vItem._retain = true;
                let parent = vItem.parent;
                while (parent) {
                    parent._retain = true;
                    parent = parent.parent;
                }
            }
        }
        return new Promise(resolve => {
            setTimeout(() => {
                for (let i = 0; i < len; i += 1) {
                    const vItem = data[i];
                    if (vItem._retain) {
                        results.push(vItem);
                        vItem._retain = undefined;
                    }
                }
                resolve(results);
            });
        });
    }
    _renderItemClass($item, vitem) {
        $item.classList.add('node-item');
        $item.classList.toggle('node-item-active', String(vitem.virtualKey) === this.activeKey);
        $item.style.paddingLeft = this.#indent(vitem) + 'px';
    }
    _renderItemArrow($item, vitem) {
        let $toggle = $item.querySelector('.node-toggle');
        if (!$toggle) {
            $toggle = document.createElement('span');
            $toggle.className = 'node-toggle';
            $item.children.length
                ? $item.insertBefore($toggle, $item.firstElementChild)
                : $item.appendChild($toggle);
        }
        if (this.hasChild(vitem)) {
            $toggle.classList.remove('is-leaf');
            $toggle.classList.toggle('folded', !vitem.expanded);
            $toggle.classList.toggle('expanded', !!vitem.expanded);
        }
        else {
            $toggle.classList.remove('folded');
            $toggle.classList.remove('expanded');
            $toggle.classList.add('is-leaf');
        }
    }
    _renderItemCheckable($item, vitem) {
        let $check = $item.querySelector('.node-check');
        if (!this.checkable) {
            if ($check)
                $item.removeChild($check);
        }
        else {
            let $input;
            let $label;
            if (!$check) {
                $check = document.createElement('span');
                $check.className = 'node-check';
                if ($item.lastElementChild.classList.contains('node-label')) {
                    $item.insertBefore($check, $item.lastElementChild);
                }
                else {
                    $item.appendChild($check);
                }
                $input = $check.appendChild(document.createElement('input'));
                $input.name = 'node-check-name';
                $input.className = 'node-check-input';
                $label = $check.appendChild(document.createElement('label'));
                $label.classList.add('node-check-label');
            }
            else {
                $input = $check.querySelector('input');
                $label = $check.querySelector('label');
            }
            $input.id = `node-check-${vitem.virtualKey}-${this.uniqCid}`;
            $label.setAttribute('for', $input.id);
            boolSetter('checked')($input, vitem.checked);
            boolSetter('disabled')($input, this.disableCheckMethod?.(vitem.data) ?? false);
            $input.setAttribute('data-tree-node-key', vitem.virtualKey);
            if (!this.multiple) {
                $input.setAttribute('type', 'radio');
            }
            else {
                $input.setAttribute('type', 'checkbox');
                const isIndeterminate = !this.checkStrictly && vitem.indeterminate;
                $input.classList.toggle('indeterminate', isIndeterminate);
                $input.indeterminate = isIndeterminate;
            }
        }
    }
    _renderItemContent($item, vitem) {
        let $label = $item.querySelector('.node-label');
        let $labelText;
        if (!$label) {
            $label = $item.appendChild(document.createElement('span'));
            $labelText = $label.appendChild(document.createElement('span'));
            $label.classList.add('node-label');
        }
        else {
            $labelText = $label.querySelector('span');
        }
        const text = this.internalLabelMethod(vitem.data);
        if (this.search && this.search.length) {
            $labelText.innerHTML = this.parseHighlight(text, this.search)
                .map(textSlice => {
                return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`;
            })
                .join('');
        }
        else {
            $labelText.innerHTML = text;
        }
    }
    itemRender($item, vitem) {
        this._renderItemClass($item, vitem);
        this._renderItemArrow($item, vitem);
        this._renderItemCheckable($item, vitem);
        this._renderItemContent($item, vitem);
    }
    disableActiveMethod(data) {
        return false;
    }
    disableToggleMethod(data) {
        return false;
    }
    disableCheckMethod(data) {
        return false;
    }
    active(virtualKey, options) {
        if (!this.activable)
            return;
        const oldKey = this.activeKey ?? '';
        const newItem = this.getVirtualItemByKey(virtualKey);
        if (!newItem)
            return;
        this.activeKey = virtualKey;
        const $newNode = this.getNodeByVirtualKey(virtualKey);
        this.itemRender($newNode, newItem);
        const oldItem = this.getVirtualItemByKey(oldKey);
        const $oldNode = this.getNodeByVirtualKey(oldKey);
        if ($oldNode) {
            this.itemRender($oldNode, oldItem);
        }
        if (!options || !options.preventEmit) {
            dispatchEvent(this, 'active', {
                detail: { key: virtualKey, oldKey },
            });
        }
    }
    getActive() {
        return this.activeKey;
    }
    clearActive(options) {
        if (this.activeKey) {
            const virtualKey = this.activeKey;
            this.activeKey = null;
            if (!options || !options.preventEmit) {
                dispatchEvent(this, 'inactive', {
                    detail: { key: virtualKey },
                });
            }
        }
    }
    expand(virtualKey) {
        const node = this.getVirtualItemByKey(virtualKey);
        if (node)
            return this.#expand(node);
    }
    fold(virtualKey) {
        const node = this.getVirtualItemByKey(virtualKey);
        if (node)
            return this.#fold(node);
    }
    toggle(virtualKey) {
        const node = this.getVirtualItemByKey(virtualKey);
        if (!node)
            return;
        if (node.expanded)
            this.#fold(node);
        else
            this.#expand(node);
    }
    foldAll() {
        ;
        this.virtualData.forEach(node => {
            if (node.children) {
                node.expanded = false;
            }
        });
        this.#batchUpdateFold = true;
        this.#updateFold(this.virtualData);
        this.#batchUpdateFold = false;
    }
    expandAll() {
        ;
        this.virtualData.forEach(node => {
            if (node.children)
                node.expanded = true;
        });
        this.#batchUpdateFold = true;
        this.#updateFold(this.virtualData);
        this.#batchUpdateFold = false;
    }
    #toggleCheck(virtualKey, value, options = {}) {
        if (!this.checkable)
            return;
        const vitem = this.getVirtualItemByKey(virtualKey);
        if (!vitem || vitem.checked === value)
            return;
        if (!this.multiple) {
            this.#toggleRadio(vitem, options);
            return;
        }
        this.#batchToggleCheck([virtualKey], value, options);
    }
    #toggleRadio(vitem, options) {
        if (this.#lastChecked) {
            if (this.#lastChecked === vitem)
                return;
            this.#updateCheck(this.#lastChecked, false, options.toggleCheckEvent);
            dispatchEvent(this, 'select-list:deselect', {
                detail: {
                    value: {
                        label: this.internalLabelMethod(this.#lastChecked.data),
                        value: this.#lastChecked.virtualKey,
                    },
                },
            });
        }
        this.#updateCheck(vitem, true, options.toggleCheckEvent);
        this.#lastChecked = vitem;
        dispatchEvent(this, 'select-list:select', {
            detail: {
                value: {
                    value: vitem.virtualKey,
                    label: this.internalLabelMethod(vitem.data),
                },
            },
        });
        dispatchEvent(this, 'select-list:change');
    }
    #batchToggleCheckStrictly(vItems, value, options = {}) {
        const disabled = typeof options.disabled === 'boolean' ? options.disabled : false;
        const checked = typeof value === 'boolean' ? value : !vItems.every(vitem => vitem.checked);
        vItems.forEach(vitem => {
            if (disabled || !this.disableCheckMethod(vitem.data)) {
                this.#updateCheck(vitem, checked, options.toggleCheckEvent);
            }
        });
    }
    #batchToggleCheckNonStrictly(vItems, value, options = {}) {
        const disabled = typeof options.disabled === 'boolean' ? options.disabled : false;
        if (!disabled) {
            vItems = vItems.filter(vitem => !this.disableCheckMethod(vitem.data));
            if (!vItems.length)
                return;
        }
        const descendant = flatten(vItems.map(this.#descendant.bind(this)));
        const excluded = [];
        const leaves = [];
        if (disabled) {
            descendant.forEach(vitem => {
                if (isEmpty(vitem.children)) {
                    leaves.push(vitem);
                }
            });
        }
        else {
            descendant.forEach(vitem => {
                if (this.disableCheckMethod(vitem.data)) {
                    excluded.push(vitem);
                }
                else if (isEmpty(vitem.children)) {
                    leaves.push(vitem);
                }
            });
        }
        let checked;
        if (value == null) {
            checked = !(leaves.length
                ? leaves.every(leaf => leaf.checked)
                : vItems.every(node => node.checked));
        }
        else {
            checked = !!value;
        }
        {
            leaves.forEach(vitem => {
                this.#updateCheck(vitem, checked, options.toggleCheckEvent);
                this.#updateIndeterminate(vitem, false);
            });
            vItems.forEach(vitem => {
                this.#updateCheck(vitem, checked, options.toggleCheckEvent);
                this.#updateIndeterminate(vitem, false);
            });
        }
        {
            leaves.forEach(vitem => this.#updateAncestorFrom(vitem, options.toggleCheckEvent));
            vItems.forEach(vitem => this.#updateAncestorFrom(vitem, options.toggleCheckEvent));
            excluded.forEach(vitem => {
                if (vitem.checked !== checked)
                    this.#updateAncestorFrom(vitem, options.toggleCheckEvent);
            });
        }
    }
    #batchToggleCheck(virtualKeys, value, options = {}) {
        if (!this.multiple)
            return;
        const vitems = uniqBy(vitem => vitem.virtualKey, virtualKeys.map(this.getVirtualItemByKey.bind(this)));
        if (!vitems.length)
            return;
        options = merge({}, options, { toggleCheckEvent: {} });
        if (this.checkStrictly) {
            this.#batchToggleCheckStrictly(vitems, value, options);
        }
        else {
            this.#batchToggleCheckNonStrictly(vitems, value, options);
        }
        if (!options.preventEmit && !isEmpty(options.toggleCheckEvent)) {
            Object.keys(options.toggleCheckEvent).forEach(eventName => {
                const data = options.toggleCheckEvent[eventName];
                if (data.length === 1) {
                    dispatchEvent(this, eventName, {
                        detail: {
                            value: {
                                value: this.internalKeyMethod(data[0]),
                                label: this.internalLabelMethod(data[0]),
                            },
                        },
                    });
                }
            });
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => {
                        return {
                            label: this.internalLabelMethod(data),
                            value: this.internalKeyMethod(data),
                        };
                    }),
                },
            });
        }
    }
    #updateCheck(vitem, checked, event = {}) {
        if (vitem.checked !== checked) {
            const eventName = checked ? 'select-list:select' : 'select-list:deselect';
            if (!event[eventName]) {
                event[eventName] = [];
            }
            event[eventName].push({
                value: vitem.virtualKey,
                label: this.internalLabelMethod(vitem.data),
            });
        }
        vitem.checked = checked;
        this._checkedSet[checked ? 'add' : 'delete'](vitem);
        const $item = this.getNodeByVirtualKey(vitem.virtualKey);
        if ($item)
            this.itemRender($item, vitem);
    }
    #updateIndeterminate(vitem, value) {
        vitem.indeterminate = value;
        const $item = this.getNodeByVirtualKey(vitem.virtualKey);
        if ($item) {
            const $input = $item.querySelector('input');
            $input.indeterminate = value;
            $input.classList.toggle('indeterminate', value);
        }
    }
    #childrenStatus(vitem) {
        const children = vitem.children;
        let count = children?.length;
        if (!count)
            return [0, false];
        let hasIndeterminateChild = false;
        let checkedCount = 0;
        while (count--) {
            const child = children[count];
            if (child.checked)
                checkedCount += 1;
            else if (child.indeterminate)
                hasIndeterminateChild = true;
        }
        if (checkedCount === children.length) {
            return [1, false];
        }
        if (checkedCount > 0) {
            return [0.5, true];
        }
        return [0, hasIndeterminateChild];
    }
    #updateAncestorFrom(node, event) {
        const ancestor = this.#ancestor(node).reverse();
        let hasIndeterminate = false;
        while (ancestor.length) {
            const parent = ancestor.pop();
            if (!parent)
                break;
            if (hasIndeterminate) {
                this.#updateCheck(parent, false, event);
                this.#updateIndeterminate(parent, true);
                continue;
            }
            const [checkedStatus, indeterminate] = this.#childrenStatus(parent);
            if (indeterminate) {
                hasIndeterminate = true;
                this.#updateCheck(parent, false, event);
                this.#updateIndeterminate(parent, true);
                continue;
            }
            this.#updateCheck(parent, checkedStatus === 1, event);
            this.#updateIndeterminate(parent, checkedStatus === 0.5);
        }
    }
    #updateFold(vItems) {
        const expandItems = vItems.filter(vItem => vItem.expanded);
        const foldedItems = vItems.filter(vItem => !vItem.expanded);
        foldedItems.forEach(vItem => {
            this.#fold(vItem);
        });
        expandItems.forEach(vItem => {
            this.#expand(vItem);
        });
    }
    #expand(vitem, preventEmit = false) {
        vitem.expanded = true;
        const listKeys = this.#descendant(vitem)
            .filter(child => this.visible(child))
            .map(child => child.virtualKey);
        if (listKeys.length) {
            this.showByKeys(listKeys, this.#batchUpdateFold);
        }
        if (!preventEmit) {
            dispatchEvent(this, 'expand', {
                detail: { key: vitem.virtualKey },
            });
        }
    }
    #fold(node, preventEmit = false) {
        node.expanded = false;
        const children = this.#descendant(node);
        const listKeys = children.map(child => child.virtualKey);
        if (listKeys.length) {
            this.hideByKeys(listKeys, this.#batchUpdateFold);
        }
        if (this.activeKey &&
            children.findIndex(child => child.virtualKey === this.activeKey) !== -1) {
            const virtualKey = this.activeKey;
            this.activeKey = null;
            if (!preventEmit) {
                dispatchEvent(this, 'inactive', {
                    detail: { key: virtualKey },
                });
            }
        }
        if (!preventEmit) {
            dispatchEvent(this, 'fold', {
                detail: { key: node.virtualKey },
            });
        }
    }
    #descendant(node) {
        const pickChild = (node, children = []) => {
            if (!node.children)
                return children;
            node.children.forEach(child => {
                children.push(child);
                pickChild(child, children);
            });
            return children;
        };
        return pickChild(node);
    }
    #ancestor(node) {
        const result = [];
        while (node.parent) {
            result.push(node.parent);
            node = node.parent;
        }
        return result;
    }
    #siblings(node) {
        const parent = node.parent;
        if (parent) {
            return parent.children ?? [];
        }
        return this.virtualData.filter(node => !node.parent);
    }
    async virtualMap(data) {
        const virtualData = [];
        let index = 0;
        const convert = (data) => {
            const virtualKey = this.internalKeyMethod(data) ?? index;
            const vnode = new VirtualNode({
                virtualKey,
                height: this.defaultItemSize,
                data,
                checked: false,
                expanded: true,
                children: [],
            });
            virtualData.push(vnode);
            index += 1;
            const len = data.children?.length;
            if (len) {
                for (let i = 0; i < len; i += 1) {
                    const childNode = convert(data.children[i]);
                    childNode.parent = vnode;
                    childNode.parentKey = vnode.virtualKey;
                    vnode.children.push(childNode);
                }
            }
            return vnode;
        };
        data.forEach(convert);
        return virtualData;
    }
    render() {
        super.render();
    }
    level(node) {
        let level = 1;
        while (node.parent) {
            level += 1;
            node = node.parent;
        }
        return level;
    }
    isTopLevel(node) {
        return !!node.parent;
    }
    hasChild(node) {
        return node.children && node.children.length > 0;
    }
    visible(node) {
        if (node.parent && (!node.parent.expanded || !this.visible(node.parent))) {
            return false;
        }
        return true;
    }
    parseHighlight(label, highlightText) {
        return parseHighlight(label, highlightText);
    }
    #onClick(e) {
        let nodeItem;
        let el = e.target;
        let doToggle = false;
        let doCheck = false;
        let doActive = false;
        while (el) {
            if (el === e.currentTarget)
                break;
            if (el.classList.contains('node-toggle')) {
                nodeItem = el.parentElement;
                doToggle = true;
                break;
            }
            if (el.classList.contains('node-check-input')) {
                nodeItem = el.parentElement
                    .parentElement;
                if (el.disabled) {
                    break;
                }
                doCheck = true;
                break;
            }
            if (el.classList.contains('node-label')) {
                nodeItem = el.parentElement;
                doActive = true;
                if (this.expandOnClickNode) {
                    doToggle = true;
                }
                if (this.checkOnClickNode) {
                    doCheck = true;
                }
                break;
            }
            if (el.classList.contains('node-item')) {
                nodeItem = el;
                doActive = true;
                break;
            }
            el = el.parentNode;
        }
        if (!nodeItem)
            return;
        const virtualKey = nodeItem.dataset.virtualKey;
        if (doToggle) {
            if (!this.disableToggleMethod(this.getVirtualItemByKey(virtualKey).data)) {
                this.toggle(virtualKey);
            }
        }
        if (doCheck) {
            if (!this.disableCheckMethod(this.getVirtualItemByKey(virtualKey).data)) {
                this.#toggleCheck(virtualKey);
            }
        }
        if (doActive) {
            if (!this.disableActiveMethod(this.getVirtualItemByKey(virtualKey).data)) {
                this.active(virtualKey);
            }
        }
        dispatchEvent(this, 'click', {
            detail: { key: virtualKey },
        });
    }
    #indent(node) {
        return (this.level(node) - 1) * this.indentUnit;
    }
    #nodeStyle(node) {
        const indent = this.#indent(node);
        return {
            paddingLeft: `${indent}px`,
        };
    }
}
if (!customElements.get('bl-tree')) {
    customElements.define('bl-tree', BlocksTree);
}
