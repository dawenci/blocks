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
import './body.js';
import './header.js';
import '../scrollable/index.js';
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { make } from './RowColumn.js';
import { onDragMove } from '../../common/onDragMove.js';
import { setStyles } from '../../common/style.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { style } from './table.style.js';
import { Component } from '../component/Component.js';
export let BlocksTable = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-table',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _border_decorators;
    let _border_initializers = [];
    var BlocksTable = class extends Component {
        static {
            _border_decorators = [attr('boolean')];
            __esDecorate(this, null, _border_decorators, { kind: "accessor", name: "border", static: false, private: false, access: { has: obj => "border" in obj, get: obj => obj.border, set: (obj, value) => { obj.border = value; } } }, _border_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTable = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        _data = (__runInitializers(this, _instanceExtraInitializers), void 0);
        _columns = [];
        width;
        disableActiveMethod;
        shouldShowFixedColumns;
        #border_accessor_storage = __runInitializers(this, _border_initializers, void 0);
        get border() { return this.#border_accessor_storage; }
        set border(value) { this.#border_accessor_storage = value; }
        constructor() {
            super();
            const $mainHeader = document.createElement('bl-table-header');
            $mainHeader.$host = this;
            this.appendShadowChild($mainHeader);
            const $mainBody = document.createElement('bl-table-body');
            $mainBody.$host = this;
            this.appendShadowChild($mainBody);
            const $resizeHandle = document.createElement('div');
            $resizeHandle.id = 'resize-handle';
            this.appendShadowChild($resizeHandle);
            $mainBody.addEventListener('bl:scroll', () => {
                $mainHeader.viewportScrollLeft = $mainBody.getScrollCross();
            });
            $mainBody.addEventListener('bl:change:can-scroll-left', () => {
                this._updateFiexedColumnShadow();
            });
            $mainBody.addEventListener('bl:change:can-scroll-right', () => {
                this._updateFiexedColumnShadow();
            });
            $mainHeader.addEventListener('enter-cell', e => {
                const { $cell, column } = e.detail;
                if (column.resizable && !column.children?.length && !this.classList.contains('resizing')) {
                    $resizeHandle.$cell = $cell;
                    $resizeHandle.column = column;
                    setStyles($resizeHandle, {
                        height: $cell.offsetHeight + 'px',
                        left: $cell.offsetLeft + $cell.clientWidth - $mainHeader.viewportScrollLeft - 3 + 'px',
                        top: $cell.offsetTop + 'px',
                    });
                }
            });
            $mainHeader.addEventListener('sort', (e) => {
                const column = e.detail.column;
                $mainBody.sortField = column.prop;
                $mainBody.sortOrder = column.sortOrder;
            });
            this.$mainHeader = $mainHeader;
            this.$mainBody = $mainBody;
            this.$resizeHandle = $resizeHandle;
            this._initResizeEvent();
            this.#setupBorder();
        }
        get data() {
            return this._data ?? [];
        }
        set data(value) {
            this._data = value;
            this.$mainBody.data = value;
        }
        get columns() {
            return this._columns ?? [];
        }
        set columns(value) {
            this._columns = (value ?? []).map((options) => make(options));
            this.$mainHeader.columns = value;
            this.$mainBody.columns = value;
            this._updateFiexedColumnShadow();
        }
        activeRow = null;
        resizeHandlerLeft = -5;
        resizeHandlerRight = -5;
        resizehandler = null;
        resizeStartOffset = 0;
        _updateFiexedColumnShadow() {
            const { $mainBody } = this;
            const leftSize = $mainBody.getFixedLeftShadowPosition();
            const rightSize = $mainBody.getFixedRightShadowPosition();
            if (leftSize && $mainBody.$viewport.canScrollLeft) {
                if (!this.$fixedLeftShadow) {
                    this.$fixedLeftShadow = document.createElement('div');
                    this.$fixedLeftShadow.id = 'fixed-left-shadow';
                }
                if (!this.$fixedLeftShadow.parentNode) {
                    this.shadowRoot.appendChild(this.$fixedLeftShadow);
                }
                this.$fixedLeftShadow.style.left = leftSize - 1 + 'px';
            }
            else {
                if (this.$fixedLeftShadow) {
                    if (this.$fixedLeftShadow.parentNode) {
                        this.shadowRoot.removeChild(this.$fixedLeftShadow);
                    }
                }
            }
            if (rightSize && $mainBody.$viewport.canScrollRight) {
                if (!this.$fixedRightShadow) {
                    this.$fixedRightShadow = document.createElement('div');
                    this.$fixedRightShadow.id = 'fixed-right-shadow';
                }
                if (!this.$fixedRightShadow.parentNode) {
                    this.shadowRoot.appendChild(this.$fixedRightShadow);
                }
                this.$fixedRightShadow.style.right = rightSize + 'px';
            }
            else {
                if (this.$fixedRightShadow) {
                    if (this.$fixedRightShadow.parentNode) {
                        this.shadowRoot.removeChild(this.$fixedRightShadow);
                    }
                }
            }
            this.style.minWidth = leftSize + rightSize + 80 + 'px';
        }
        render() {
            super.render();
            this.$mainHeader.render();
            this.$mainBody.render();
        }
        _clearResizeHandler;
        connectedCallback() {
            super.connectedCallback();
            this.upgradeProperty(['columns', 'data']);
            this._clearResizeHandler = sizeObserve(this, () => {
                this.layout(this.getCanvasWidth());
                this.render();
                this._updateFiexedColumnShadow();
            });
        }
        disconnectedCallback() {
            if (this._clearResizeHandler) {
                this._clearResizeHandler();
            }
        }
        #setupBorder() {
            const update = () => {
                this.$mainHeader.border = this.border;
                this.$mainBody.border = this.border;
            };
            this.onAttributeChangedDep('border', update);
            update();
        }
        getLeafColumnsWith(pred) {
            const columns = [];
            const flat = (column, parentColumn) => {
                if (pred && !pred(column, parentColumn))
                    return;
                if (column?.children?.length) {
                    column.children.forEach((child) => flat(child, column));
                }
                else {
                    columns.push(column);
                }
            };
            this.columns.forEach((child) => flat(child, null));
            return columns;
        }
        getFixedLeafColumns(area) {
            if (area === 'left' || area === 'right') {
                const prop = area === 'left' ? 'fixedLeft' : 'fixedRight';
                return this.getLeafColumnsWith(column => {
                    let col = column;
                    while (col) {
                        if (col[prop])
                            return true;
                        col = col.parent;
                    }
                    return false;
                });
            }
            return this.getLeafColumnsWith(column => {
                let col = column;
                while (col) {
                    if (col.fixedLeft || col.fixedRight)
                        return true;
                    col = col.parent;
                }
                return false;
            });
        }
        hasFixedLeft() {
            return this.columns.some(column => !!column.fixedLeft);
        }
        hasFixedRight() {
            return this.columns.some(column => !!column.fixedRight);
        }
        fixedLeftWidth() {
            return this.getFixedLeafColumns('left').reduce((acc, column) => acc + column.width, 0);
        }
        fixedRightWidth() {
            return this.getFixedLeafColumns('right').reduce((acc, column) => acc + column.width, 0);
        }
        getCanvasWidth() {
            const columnsMinWidth = this.getLeafColumnsWith().reduce((acc, column) => acc + column.minWidth, 0);
            const bodyWidth = this.$mainBody?.clientWidth ?? this.width ?? 400;
            return Math.max(bodyWidth, columnsMinWidth);
        }
        layout(canvasWidth) {
            this.$mainHeader.$canvas.style.width = canvasWidth + 'px';
            this.$mainBody.crossSize = canvasWidth;
            const sum = this.getLeafColumnsWith().reduce((acc, column) => acc + column.width, 0);
            const remainingWidth = canvasWidth - sum;
            if (remainingWidth === 0) {
                dispatchEvent(this, 'layout');
                return;
            }
            if (remainingWidth > 0) {
                this._expandColumns(remainingWidth, this.getLeafColumnsWith());
                dispatchEvent(this, 'layout');
                return;
            }
            this._shrinkColumns(-remainingWidth, this.getLeafColumnsWith());
            dispatchEvent(this, 'layout');
        }
        active(rowKey) {
            const row = this.$mainBody.getVirtualItemByKey(rowKey);
            if (!row) {
                if (this.activeRow) {
                    ;
                    this.activeRow.active = false;
                }
                this.activeRow = null;
                return;
            }
            if (this.disableActiveMethod && this.disableActiveMethod(row)) {
                return;
            }
            if (this.activeRow && row !== this.activeRow) {
                ;
                this.activeRow.active = false;
            }
            ;
            row.active = true;
            this.activeRow = row;
        }
        _getGrowSize(column) {
            if (column.resizable)
                return 0;
            const size = column.maxWidth - column.width;
            if (size > 0)
                return size;
            return 0;
        }
        _getShrinkSize(column) {
            if (column.resizable)
                return 0;
            const size = column.width - column.minWidth;
            if (size > 0)
                return size;
            return 0;
        }
        _expandColumns(rest, columns) {
            const loop = (rest, columns) => {
                const list = columns.filter(column => this._getGrowSize(column) >= 1);
                if (!list.length)
                    return;
                const expand = rest / list.length;
                list.forEach(column => {
                    const actual = Math.min(this._getGrowSize(column), expand);
                    column.width += actual;
                    rest -= actual;
                });
                if (rest >= 1) {
                    loop(rest, list);
                }
            };
            loop(rest, columns);
        }
        _shrinkColumns(rest, columns) {
            const loop = (rest, columns) => {
                const list = columns.filter(column => this._getShrinkSize(column) >= 1);
                if (!list.length)
                    return;
                const shrink = rest / list.length;
                list.forEach(column => {
                    const actual = Math.min(this._getShrinkSize(column), shrink);
                    column.width -= actual;
                    rest -= actual;
                });
                if (rest >= 1) {
                    loop(rest, list);
                }
            };
            loop(rest, columns);
        }
        _initResizeEvent() {
            let startX;
            let column;
            let $cell;
            const update = (offset) => {
                let newX = startX + offset.x;
                if (offset.x < 0) {
                    if (column.width + offset.x < column.minWidth) {
                        newX = startX - (column.width - column.minWidth);
                    }
                }
                else {
                    if (column.width + offset.x > column.maxWidth) {
                        newX = startX - (column.width - column.maxWidth);
                    }
                }
                return newX;
            };
            onDragMove(this.$resizeHandle, {
                onStart: () => {
                    this.classList.add('resizing');
                    startX = parseInt(this.$resizeHandle.style.left, 10);
                    column = this.$resizeHandle.column;
                    $cell = this.$resizeHandle.$cell;
                },
                onMove: ({ offset }) => {
                    const newX = update(offset);
                    this.$resizeHandle.style.left = newX + 'px';
                },
                onEnd: ({ offset }) => {
                    this.classList.remove('resizing');
                    const newX = update(offset);
                    const offsetX = newX - startX;
                    if (offsetX !== 0) {
                        column.width += offsetX;
                        this.$mainHeader.render();
                        this.$mainBody._resetCalculated();
                        this.$mainBody.redraw();
                    }
                },
                onCancel: () => {
                    this.classList.remove('resizing');
                },
            });
        }
    };
    return BlocksTable = _classThis;
})();
