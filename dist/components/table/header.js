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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { setStyles } from '../../common/style.js';
import { style } from './header.style.js';
import { template } from './header-template.js';
import { Component } from '../component/Component.js';
export let BlocksTableHeader = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-table-header',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _border_decorators;
    let _border_initializers = [];
    var BlocksTableHeader = class extends Component {
        static {
            _border_decorators = [attr('boolean')];
            __esDecorate(this, null, _border_decorators, { kind: "accessor", name: "border", static: false, private: false, access: { has: obj => "border" in obj, get: obj => obj.border, set: (obj, value) => { obj.border = value; } } }, _border_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTableHeader = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #border_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _border_initializers, void 0));
        get border() { return this.#border_accessor_storage; }
        set border(value) { this.#border_accessor_storage = value; }
        _columns = [];
        fixedLeftColumns = [];
        fixedRightColumns = [];
        constructor() {
            super();
            const { comTemplate } = template();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(comTemplate.content.cloneNode(true));
            const $viewport = shadowRoot.querySelector('#viewport');
            const $canvas = shadowRoot.querySelector('.columns');
            this.$viewport = $viewport;
            this.$canvas = $canvas;
            this._initHoverEvent();
            $canvas.onclick = (e) => {
                let $el = e.target;
                while ($el && $el !== $canvas) {
                    if ($el.classList.contains('sortable')) {
                        const column = $el.column;
                        switch (column.sortOrder) {
                            case 'none': {
                                column.sortOrder = 'ascending';
                                break;
                            }
                            case 'ascending': {
                                column.sortOrder = 'descending';
                                break;
                            }
                            case 'descending': {
                                column.sortOrder = 'none';
                                break;
                            }
                        }
                        this.$host.getLeafColumnsWith().forEach(col => {
                            if (col.sortOrder && col !== column) {
                                col.sortOrder = 'none';
                            }
                        });
                        this.render();
                        dispatchEvent(this, 'sort', {
                            detail: { column },
                        });
                        break;
                    }
                    $el = $el.parentElement;
                }
            };
        }
        get columns() {
            return this._columns;
        }
        set columns(value) {
            this._columns = value;
            this.render();
        }
        get viewportScrollLeft() {
            return this.$viewport.scrollLeft;
        }
        set viewportScrollLeft(value) {
            this.$viewport.scrollLeft = value;
        }
        _initHoverEvent() {
            this.$canvas.addEventListener('mouseover', e => {
                let $cell = e.target;
                let _$cell;
                while ($cell && $cell !== this.$canvas) {
                    if ($cell.classList.contains('cell')) {
                        if ($cell === _$cell)
                            return;
                        _$cell = $cell;
                        dispatchEvent(this, 'enter-cell', {
                            detail: {
                                $cell,
                                column: $cell.column,
                            },
                        });
                        return;
                    }
                    $cell = $cell.parentElement;
                }
            });
        }
        widthSum(column, value = 0) {
            if (column.children.length) {
                column.children.forEach(child => this.widthSum(child, value));
            }
            else {
                value += column.width;
            }
            return value;
        }
        getFixedOffsetLeft(column) {
            let value = 0;
            for (let i = 0; i < this.fixedLeftColumns.length; i += 1) {
                if (this.fixedLeftColumns[i] === column)
                    return value;
                value = this.widthSum(this.fixedLeftColumns[i], value);
            }
            return value;
        }
        getFixedOffsetRight(column) {
            let value = 0;
            for (let i = 0; i < this.fixedRightColumns.length; i += 1) {
                if (this.fixedRightColumns[i] === column)
                    return value;
                value = this.widthSum(this.fixedRightColumns[i], value);
            }
            return value;
        }
        render() {
            super.render();
            const columns = this.$host?.columns ?? [];
            this.fixedLeftColumns = columns.filter(column => column.fixedLeft);
            this.fixedRightColumns = columns.filter(column => column.fixedRight).reverse();
            const render = (column, $wrap) => {
                const { columnWidth, minWidth, maxWidth, align } = column;
                const hasChildren = !!column.children.length;
                const style = {};
                const cellStyle = {};
                if (!hasChildren) {
                    style.width = (columnWidth ?? 80) + 'px';
                    if (minWidth)
                        style.minWidth = minWidth + 'px';
                    if (maxWidth && maxWidth !== Infinity)
                        style.maxWidth = maxWidth + 'px';
                }
                if (align) {
                    cellStyle.textAlign = align;
                }
                let $content = column.headRender(column);
                if (!($content instanceof Node)) {
                    $content = document.createTextNode($content ?? '');
                }
                const { cellTemplate } = template();
                const $cell = cellTemplate.cloneNode(true);
                const $cellInner = $cell.firstElementChild;
                $cellInner.innerHTML = '';
                $cellInner.appendChild($content);
                if (!column.children?.length && column.sortOrder != null) {
                    $cell.classList.add('sortable');
                    if (!$cell.querySelector('.sort')) {
                        const $sort = $cell.appendChild(document.createElement('div'));
                        $sort.className = `sort ${column.sortOrder}`;
                    }
                }
                else {
                    $cell.classList.remove('sortable');
                    const $sort = $cell.querySelector('.sort');
                    if ($sort) {
                        $cell.removeChild($sort);
                    }
                }
                $cell.column = column;
                setStyles($cell, {
                    width: column.width + 'px',
                    minWidth: column.minWidth + 'px',
                    maxWidth: column.maxWidth + 'px',
                });
                setStyles($cellInner, {
                    textAlign: column.align,
                });
                const styles = {};
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
                if (hasChildren) {
                    const { groupTemplate } = template();
                    const $group = groupTemplate.cloneNode(true);
                    $group.querySelector('.group_label').appendChild($cell);
                    $cell.style.width = '';
                    const $children = $group.querySelector('.columns');
                    column.children.forEach(child => {
                        render(child, $children);
                    });
                    setStyles($group, styles);
                    $wrap.appendChild($group);
                }
                else {
                    setStyles($cell, styles);
                    $wrap.appendChild($cell);
                }
            };
            this.$canvas.innerHTML = '';
            columns.forEach(column => render(column, this.$canvas));
        }
        connectedCallback() {
            super.connectedCallback();
            this.upgradeProperty(['area', 'columns']);
        }
    };
    return BlocksTableHeader = _classThis;
})();
