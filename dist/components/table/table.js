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
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { make } from './RowColumn.js';
import { onDragMove } from '../../common/onDragMove.js';
import { prop } from '../../decorators/prop/index.js';
import { setStyles } from '../../common/style.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { style } from './table.style.js';
import { BlComponent } from '../component/Component.js';
export let BlTable = (() => {
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
    let _columns_decorators;
    let _columns_initializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _$mainHeader_decorators;
    let _$mainHeader_initializers = [];
    let _$mainBody_decorators;
    let _$mainBody_initializers = [];
    let _$resizeHandle_decorators;
    let _$resizeHandle_initializers = [];
    var BlTable = class extends BlComponent {
        static {
            _border_decorators = [attr('boolean')];
            _columns_decorators = [prop({
                    get(self) {
                        return self._columns ?? [];
                    },
                    set(self, value) {
                        self._columns = (value ?? []).map((options) => make(options));
                        self.$mainHeader.columns = value;
                        self.$mainBody.columns = value;
                        self.render();
                    },
                })];
            _data_decorators = [prop({
                    get(self) {
                        return self._data ?? [];
                    },
                    set(self, value) {
                        self._data = value;
                        self.$mainBody.data = value;
                    },
                })];
            _$mainHeader_decorators = [shadowRef('bl-table-header')];
            _$mainBody_decorators = [shadowRef('bl-table-body')];
            _$resizeHandle_decorators = [shadowRef('#resize-handle')];
            __esDecorate(this, null, _border_decorators, { kind: "accessor", name: "border", static: false, private: false, access: { has: obj => "border" in obj, get: obj => obj.border, set: (obj, value) => { obj.border = value; } } }, _border_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _columns_decorators, { kind: "accessor", name: "columns", static: false, private: false, access: { has: obj => "columns" in obj, get: obj => obj.columns, set: (obj, value) => { obj.columns = value; } } }, _columns_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _data_decorators, { kind: "accessor", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } } }, _data_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$mainHeader_decorators, { kind: "accessor", name: "$mainHeader", static: false, private: false, access: { has: obj => "$mainHeader" in obj, get: obj => obj.$mainHeader, set: (obj, value) => { obj.$mainHeader = value; } } }, _$mainHeader_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$mainBody_decorators, { kind: "accessor", name: "$mainBody", static: false, private: false, access: { has: obj => "$mainBody" in obj, get: obj => obj.$mainBody, set: (obj, value) => { obj.$mainBody = value; } } }, _$mainBody_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$resizeHandle_decorators, { kind: "accessor", name: "$resizeHandle", static: false, private: false, access: { has: obj => "$resizeHandle" in obj, get: obj => obj.$resizeHandle, set: (obj, value) => { obj.$resizeHandle = value; } } }, _$resizeHandle_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlTable = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'table';
        }
        _data = (__runInitializers(this, _instanceExtraInitializers), void 0);
        _columns = [];
        width;
        disableActiveMethod;
        shouldShowFixedColumns;
        #border_accessor_storage = __runInitializers(this, _border_initializers, void 0);
        get border() { return this.#border_accessor_storage; }
        set border(value) { this.#border_accessor_storage = value; }
        #columns_accessor_storage = __runInitializers(this, _columns_initializers, void 0);
        get columns() { return this.#columns_accessor_storage; }
        set columns(value) { this.#columns_accessor_storage = value; }
        #data_accessor_storage = __runInitializers(this, _data_initializers, void 0);
        get data() { return this.#data_accessor_storage; }
        set data(value) { this.#data_accessor_storage = value; }
        #$mainHeader_accessor_storage = __runInitializers(this, _$mainHeader_initializers, void 0);
        get $mainHeader() { return this.#$mainHeader_accessor_storage; }
        set $mainHeader(value) { this.#$mainHeader_accessor_storage = value; }
        #$mainBody_accessor_storage = __runInitializers(this, _$mainBody_initializers, void 0);
        get $mainBody() { return this.#$mainBody_accessor_storage; }
        set $mainBody(value) { this.#$mainBody_accessor_storage = value; }
        #$resizeHandle_accessor_storage = __runInitializers(this, _$resizeHandle_initializers, void 0);
        get $resizeHandle() { return this.#$resizeHandle_accessor_storage; }
        set $resizeHandle(value) { this.#$resizeHandle_accessor_storage = value; }
        constructor() {
            super();
            this.#setupHeader();
            this.#setupBody();
            this.#setupResize();
            this.#setupFixedColumnShadow();
        }
        activeRow = null;
        resizeHandlerLeft = -5;
        resizeHandlerRight = -5;
        resizehandler = null;
        resizeStartOffset = 0;
        #setupHeader() {
            const $mainHeader = document.createElement('bl-table-header');
            $mainHeader.$host = this;
            this.appendShadowChild($mainHeader);
            this.$mainHeader.addEventListener('sort', (e) => {
                const column = e.detail.column;
                this.$mainBody.sortField = column.prop;
                this.$mainBody.sortOrder = column.sortOrder;
            });
            const updateHeader = () => this.$mainHeader.render();
            this.hook.onRender(updateHeader);
            const updateBorder = () => {
                this.$mainHeader.border = this.border;
            };
            this.hook.onRender(updateBorder);
            this.hook.onAttributeChangedDep('border', updateBorder);
            this.hook.onConnected(updateBorder);
        }
        #setupBody() {
            const $mainBody = document.createElement('bl-table-body');
            $mainBody.$host = this;
            this.appendShadowChild($mainBody);
            this.$mainBody.addEventListener('bl:scroll', () => {
                this.$mainHeader.viewportScrollLeft = $mainBody.getScrollCross();
            });
            this.hook.onRender(() => {
                this.$mainBody.render();
            });
            const updateBorder = () => {
                this.$mainBody.border = this.border;
            };
            this.hook.onRender(updateBorder);
            this.hook.onAttributeChangedDep('border', updateBorder);
            this.hook.onConnected(updateBorder);
        }
        #setupResize() {
            const $resizeHandle = document.createElement('div');
            $resizeHandle.id = 'resize-handle';
            this.appendShadowChild($resizeHandle);
            this.$mainHeader.addEventListener('enter-cell', e => {
                const { $cell, column } = e.detail;
                if (column.resizable && !column.children?.length && !this.classList.contains('resizing')) {
                    this.$resizeHandle.$cell = $cell;
                    this.$resizeHandle.column = column;
                    setStyles(this.$resizeHandle, {
                        height: $cell.offsetHeight + 'px',
                        left: $cell.offsetLeft + $cell.clientWidth - this.$mainHeader.viewportScrollLeft - 3 + 'px',
                        top: $cell.offsetTop + 'px',
                    });
                }
            });
            const initEvent = () => {
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
                return onDragMove(this.$resizeHandle, {
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
                            dispatchEvent(this, 'column-resize');
                        }
                    },
                    onCancel: () => {
                        this.classList.remove('resizing');
                    },
                });
            };
            let clear;
            this.hook.onConnected(() => {
                clear = initEvent();
            });
            this.hook.onDisconnected(() => {
                if (clear) {
                    clear();
                }
            });
        }
        #setupFixedColumnShadow() {
            const update = () => {
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
            };
            this.$mainBody.addEventListener('bl:change:can-scroll-left', () => {
                update();
            });
            this.$mainBody.addEventListener('bl:change:can-scroll-right', () => {
                update();
            });
            this.addEventListener('column-resize', () => {
                update();
            });
            let stopObserve;
            this.hook.onConnected(() => {
                stopObserve = sizeObserve(this, () => {
                    this.layout(this.getCanvasWidth());
                    this.render();
                    update();
                });
            });
            this.hook.onDisconnected(() => {
                if (stopObserve) {
                    stopObserve();
                }
            });
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
    };
    return BlTable = _classThis;
})();
