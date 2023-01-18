import { dispatchEvent } from '../../common/event.js';
import { boolGetter, boolSetter } from '../../common/property.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { make } from './RowColumn.js';
import '../scrollable/index.js';
import './header.js';
import './body.js';
import { setStyles } from '../../common/style.js';
import { onDragMove } from '../../common/onDragMove.js';
import { Component, } from '../Component.js';
import { template } from './table-template.js';
let gridId = 0;
export class BlocksTable extends Component {
    _data;
    _columns = [];
    width;
    disableActiveMethod;
    shouldShowFixedColumns;
    static get observedAttributes() {
        return ['border'];
    }
    constructor() {
        super();
        const { cssTemplate } = template();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(cssTemplate.cloneNode(true));
        const $mainHeader = shadowRoot.appendChild(document.createElement('bl-table-header'));
        $mainHeader.$host = this;
        const $mainBody = shadowRoot.appendChild(document.createElement('bl-table-body'));
        $mainBody.$host = this;
        const $resizeHandle = shadowRoot.appendChild(document.createElement('div'));
        $resizeHandle.id = 'resize-handle';
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
            if (column.resizable &&
                !column.children?.length &&
                !this.classList.contains('resizing')) {
                $resizeHandle.$cell = $cell;
                $resizeHandle.column = column;
                setStyles($resizeHandle, {
                    height: $cell.offsetHeight + 'px',
                    left: $cell.offsetLeft +
                        $cell.clientWidth -
                        $mainHeader.viewportScrollLeft -
                        3 +
                        'px',
                    top: $cell.offsetTop + 'px',
                });
            }
        });
        $mainHeader.addEventListener('sort', (e) => {
            const column = e.detail.column;
            $mainBody.sortField = column.prop;
            $mainBody.sortOrder = column.sortOrder;
        });
        this._ref = {
            $mainHeader,
            $mainBody,
            $resizeHandle,
        };
        this._initResizeEvent();
    }
    get border() {
        return boolGetter('border')(this);
    }
    set border(value) {
        boolSetter('border')(this, value);
    }
    get data() {
        return this._data ?? [];
    }
    set data(value) {
        this._data = value;
        this._ref.$mainBody.data = value;
    }
    get columns() {
        return this._columns ?? [];
    }
    set columns(value) {
        this._columns = (value ?? []).map((options) => make(options));
        this._ref.$mainHeader.columns = value;
        this._ref.$mainBody.columns = value;
        this._updateFiexedColumnShadow();
    }
    activeRow = null;
    resizeHandlerLeft = -5;
    resizeHandlerRight = -5;
    gridId = ++gridId;
    resizehandler = null;
    resizeStartOffset = 0;
    _updateFiexedColumnShadow() {
        const { $mainBody } = this._ref;
        const leftSize = $mainBody.getFixedLeftShadowPosition();
        const rightSize = $mainBody.getFixedRightShadowPosition();
        if (leftSize && $mainBody._ref.$viewport.canScrollLeft) {
            if (!this._ref.$fixedLeftShadow) {
                this._ref.$fixedLeftShadow = document.createElement('div');
                this._ref.$fixedLeftShadow.id = 'fixed-left-shadow';
            }
            if (!this._ref.$fixedLeftShadow.parentNode) {
                this.shadowRoot.appendChild(this._ref.$fixedLeftShadow);
            }
            this._ref.$fixedLeftShadow.style.left = leftSize - 1 + 'px';
        }
        else {
            if (this._ref.$fixedLeftShadow) {
                if (this._ref.$fixedLeftShadow.parentNode) {
                    this.shadowRoot.removeChild(this._ref.$fixedLeftShadow);
                }
            }
        }
        if (rightSize && $mainBody._ref.$viewport.canScrollRight) {
            if (!this._ref.$fixedRightShadow) {
                this._ref.$fixedRightShadow = document.createElement('div');
                this._ref.$fixedRightShadow.id = 'fixed-right-shadow';
            }
            if (!this._ref.$fixedRightShadow.parentNode) {
                this.shadowRoot.appendChild(this._ref.$fixedRightShadow);
            }
            this._ref.$fixedRightShadow.style.right = rightSize + 'px';
        }
        else {
            if (this._ref.$fixedRightShadow) {
                if (this._ref.$fixedRightShadow.parentNode) {
                    this.shadowRoot.removeChild(this._ref.$fixedRightShadow);
                }
            }
        }
        this.style.minWidth = leftSize + rightSize + 80 + 'px';
    }
    render() {
        this._ref.$mainHeader.render();
        this._ref.$mainBody.render();
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
        const bodyWidth = this._ref.$mainBody?.clientWidth ?? this.width ?? 400;
        return Math.max(bodyWidth, columnsMinWidth);
    }
    layout(canvasWidth) {
        this._ref.$mainHeader._ref.$canvas.style.width = canvasWidth + 'px';
        this._ref.$mainBody.crossSize = canvasWidth;
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
        const row = this._ref.$mainBody.getVirtualItemByKey(rowKey);
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
        onDragMove(this._ref.$resizeHandle, {
            onStart: () => {
                this.classList.add('resizing');
                startX = parseInt(this._ref.$resizeHandle.style.left, 10);
                column = this._ref.$resizeHandle.column;
                $cell = this._ref.$resizeHandle.$cell;
            },
            onMove: ({ offset }) => {
                const newX = update(offset);
                this._ref.$resizeHandle.style.left = newX + 'px';
            },
            onEnd: ({ offset }) => {
                this.classList.remove('resizing');
                const newX = update(offset);
                const offsetX = newX - startX;
                if (offsetX !== 0) {
                    column.width += offsetX;
                    this._ref.$mainHeader.render();
                    this._ref.$mainBody._resetCalculated();
                    this._ref.$mainBody.redraw();
                }
            },
            onCancel: () => {
                this.classList.remove('resizing');
            },
        });
    }
}
if (!customElements.get('bl-table')) {
    customElements.define('bl-table', BlocksTable);
}
