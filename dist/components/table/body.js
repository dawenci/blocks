var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { attr } from '../../decorators/attr/index.js';
import { cellTemplate, summaryTemplate } from './body.template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { setStyles } from '../../common/style.js';
import { style, summaryStyle } from './body.style.js';
import { BlVList } from '../vlist/index.js';
export let BlTableBody = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-table-body',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _border_decorators;
    let _border_initializers = [];
    let _sortField_decorators;
    let _sortField_initializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _summaryHeight_decorators;
    let _summaryHeight_initializers = [];
    var BlTableBody = class extends BlVList {
        static {
            _border_decorators = [attr('boolean')];
            _sortField_decorators = [attr('string')];
            _sortOrder_decorators = [attr('string')];
            _summaryHeight_decorators = [attr('int')];
            __esDecorate(this, null, _border_decorators, { kind: "accessor", name: "border", static: false, private: false, access: { has: obj => "border" in obj, get: obj => obj.border, set: (obj, value) => { obj.border = value; } } }, _border_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _sortField_decorators, { kind: "accessor", name: "sortField", static: false, private: false, access: { has: obj => "sortField" in obj, get: obj => obj.sortField, set: (obj, value) => { obj.sortField = value; } } }, _sortField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _sortOrder_decorators, { kind: "accessor", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } } }, _sortOrder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _summaryHeight_decorators, { kind: "accessor", name: "summaryHeight", static: false, private: false, access: { has: obj => "summaryHeight" in obj, get: obj => obj.summaryHeight, set: (obj, value) => { obj.summaryHeight = value; } } }, _summaryHeight_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlTableBody = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'rowgroup';
        }
        static get observedAttributes() {
            return BlVList.observedAttributes.concat(['sort-field', 'sort-order', 'summary-height']);
        }
        #sortFlag = (__runInitializers(this, _instanceExtraInitializers), void 0);
        columns = [];
        flattenColumns = [];
        fixedLeftColumns = [];
        fixedRightColumns = [];
        #border_accessor_storage = __runInitializers(this, _border_initializers, void 0);
        get border() { return this.#border_accessor_storage; }
        set border(value) { this.#border_accessor_storage = value; }
        #sortField_accessor_storage = __runInitializers(this, _sortField_initializers, void 0);
        get sortField() { return this.#sortField_accessor_storage; }
        set sortField(value) { this.#sortField_accessor_storage = value; }
        #sortOrder_accessor_storage = __runInitializers(this, _sortOrder_initializers, void 0);
        get sortOrder() { return this.#sortOrder_accessor_storage; }
        set sortOrder(value) { this.#sortOrder_accessor_storage = value; }
        #summaryHeight_accessor_storage = __runInitializers(this, _summaryHeight_initializers, 0);
        get summaryHeight() { return this.#summaryHeight_accessor_storage; }
        set summaryHeight(value) { this.#summaryHeight_accessor_storage = value; }
        constructor() {
            super();
            this.$list.onclick = this._onClick.bind(this);
            this.addEventListener('bl:scroll', () => {
                if (this.$summary) {
                    this.$summary.scrollLeft = this.getScrollCross();
                }
            });
        }
        get shouldRenderSummary() {
            return this.flattenColumns.some(column => typeof column.summaryRender === 'function');
        }
        sortMethod(data, callback) {
            const column = this.flattenColumns.find(column => column.prop == this.sortField);
            if (!column || column.sortOrder === 'none') {
                return callback(data);
            }
            const $cell = document.createElement('div');
            data.sort((a, b) => {
                if (column.sortMethod) {
                    const value = column.sortMethod(a.data, b.data);
                    return value * (column.sortOrder === 'ascending' ? 1 : -1);
                }
                const labelA = column.render(a.data, column, $cell);
                const labelB = column.render(b.data, column, $cell);
                const va = labelA instanceof Node ? labelA.textContent : labelA;
                const vb = labelB instanceof Node ? labelB.textContent : labelB;
                return va.localeCompare(vb) * (column.sortOrder === 'ascending' ? 1 : -1);
            });
            callback(data);
        }
        beforeRender() {
            this.flattenColumns = this.$host.getLeafColumnsWith();
            this.fixedLeftColumns = this.$host.getFixedLeafColumns('left');
            this.fixedRightColumns = this.$host.getFixedLeafColumns('right').reverse();
        }
        afterRender() {
            this._renderSummaryRow();
        }
        itemRender($item, vitem) {
            $item.data = vitem.data;
            $item.classList.add('row');
            $item.classList.toggle('row-even', vitem.virtualViewIndex % 2 === 0);
            $item.classList.toggle('row-odd', vitem.virtualViewIndex % 2 !== 0);
            while ($item.children.length > this.flattenColumns.length) {
                $item.removeChild($item.lastElementChild);
            }
            while ($item.children.length < this.flattenColumns.length) {
                $item.appendChild(cellTemplate());
            }
            this.flattenColumns.forEach((column, index) => {
                const $cell = $item.children[index];
                const $cellInner = $cell.firstElementChild;
                let $content = column.render(vitem.data, column, $item.children[index]);
                if (!($content instanceof Node)) {
                    $content = document.createTextNode($content ?? '');
                }
                $cellInner.innerHTML = '';
                $cellInner.appendChild($content);
                $cell.className = 'cell';
                if (column.cellClass) {
                    column.cellClass.forEach(klass => {
                        $cell.classList.add(klass);
                    });
                }
                $cell.column = column;
                const styles = {
                    width: column.width + 'px',
                    minWidth: column.minWidth + 'px',
                    maxWidth: column.maxWidth + 'px',
                };
                if (this.fixedLeftColumns.includes(column)) {
                    styles.position = 'sticky';
                    styles.left = this.getFixedOffsetLeft(column) + 'px';
                    styles.zIndex = '1';
                }
                else if (this.fixedRightColumns.includes(column)) {
                    styles.position = 'sticky';
                    styles.right = this.getFixedOffsetRight(column) + 'px';
                    styles.zIndex = '1';
                }
                else {
                    styles.position = '';
                    styles.zIndex = '';
                }
                setStyles($cell, styles);
                setStyles($cellInner, {
                    textAlign: column.align,
                });
            });
        }
        _renderSummaryRow() {
            if (this.shouldRenderSummary) {
                if (!this.$summary)
                    return;
                this.$viewport.$layout.classList.toggle('has-summary', true);
                const data = this.$host.data;
                const $items = this.$summary.firstElementChild;
                while ($items.children.length > this.flattenColumns.length) {
                    $items.removeChild($items.lastElementChild);
                }
                while ($items.children.length < this.flattenColumns.length) {
                    $items.appendChild(cellTemplate());
                }
                this.flattenColumns.forEach((column, index) => {
                    const $cell = $items.children[index];
                    const $cellInner = $cell.firstElementChild;
                    let $content = column.summaryRender && column.summaryRender(column, index, data, $items.children[index]);
                    if (!($content instanceof Node)) {
                        $content = document.createTextNode($content ?? '');
                    }
                    $cellInner.innerHTML = '';
                    $cellInner.appendChild($content);
                    $cell.className = 'cell';
                    if (column.cellClass) {
                        column.cellClass.forEach(klass => {
                            $cell.classList.add(klass);
                        });
                    }
                    $cell.column = column;
                    const styles = {
                        width: column.width + 'px',
                        minWidth: column.minWidth + 'px',
                        maxWidth: column.maxWidth + 'px',
                    };
                    if (this.fixedLeftColumns.includes(column)) {
                        styles.position = 'sticky';
                        styles.left = this.getFixedOffsetLeft(column) + 'px';
                        styles.zIndex = '1';
                    }
                    else if (this.fixedRightColumns.includes(column)) {
                        styles.position = 'sticky';
                        styles.right = this.getFixedOffsetRight(column) + 'px';
                        styles.zIndex = '1';
                    }
                    else {
                        styles.position = '';
                        styles.zIndex = '';
                    }
                    setStyles($cell, styles);
                    setStyles($cellInner, {
                        textAlign: column.align,
                    });
                });
            }
            else {
                this.$viewport.$layout.classList.toggle('has-summary', false);
            }
        }
        getFixedOffsetLeft(column) {
            let value = 0;
            for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
                if (this.fixedLeftColumns[i] === column)
                    return value;
                value += column.width;
            }
            return value;
        }
        getFixedOffsetRight(column) {
            let value = 0;
            for (let i = 0; i < this.fixedRightColumns.length; i += 1) {
                if (this.fixedRightColumns[i] === column)
                    return value;
                value += column.width;
            }
            return value;
        }
        getFixedLeftShadowPosition() {
            return this.fixedLeftColumns.reduce((acc, col) => acc + col.width, 0);
        }
        getFixedRightShadowPosition() {
            return this.fixedRightColumns.reduce((acc, col) => acc + col.width, 0);
        }
        _onClick(e) {
            let $cell;
            let $row;
            let $el = e.target;
            while ($el) {
                if ($el === e.currentTarget)
                    break;
                if ($el.classList.contains('cell')) {
                    $cell = $el;
                    dispatchEvent(this, 'click-cell', {
                        detail: { $el, column: $el.column },
                    });
                }
                if ($el.classList.contains('row')) {
                    $row = $el;
                    dispatchEvent(this, 'click-row', { detail: { $el, data: $el.data } });
                    break;
                }
                $el = $el.parentElement;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.upgradeProperty(['columns', 'data']);
            requestAnimationFrame(() => {
                if (!this.$viewport.shadowRoot.querySelector('style#tableBodyStyle')) {
                    const $style = this.$viewport.insertStyle(summaryStyle);
                    $style.id = 'tableBodyStyle';
                }
                if (!this.$viewport.$layout.querySelector('#summary')) {
                    this.$summary = summaryTemplate();
                    this.$viewport.$layout.appendChild(this.$summary);
                }
            });
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'cross-size') {
                if (this.$summary) {
                    const child = this.$summary.firstElementChild;
                    child.style.width = this.crossSize + 'px';
                }
            }
            else if (attrName === 'sort-field' || attrName === 'sort-order') {
                this.doSort();
            }
        }
        doSort() {
            if (!this.#sortFlag) {
                this.#sortFlag = Promise.resolve().then(() => {
                    this.generateViewData({
                        complete: () => {
                        },
                    });
                    this.#sortFlag = undefined;
                });
            }
        }
    };
    return BlTableBody = _classThis;
})();
