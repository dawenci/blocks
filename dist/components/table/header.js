import { dispatchEvent } from '../../common/event.js';
import { setStyles } from '../../common/style.js';
import { Component } from '../Component.js';
import { template } from './header-template.js';
export class BlocksTableHeader extends Component {
    _columns = [];
    fixedLeftColumns = [];
    fixedRightColumns = [];
    constructor() {
        super();
        const { cssTemplate, comTemplate } = template();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(cssTemplate.cloneNode(true));
        shadowRoot.appendChild(comTemplate.content.cloneNode(true));
        const $viewport = shadowRoot.querySelector('#viewport');
        const $canvas = shadowRoot.querySelector('.columns');
        this._ref = {
            $viewport,
            $canvas,
        };
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
    get $host() {
        return this._ref.$host;
    }
    set $host(table) {
        this._ref.$host = table;
    }
    get columns() {
        return this._columns;
    }
    set columns(value) {
        this._columns = value;
        this.render();
    }
    get viewportScrollLeft() {
        return this._ref.$viewport.scrollLeft;
    }
    set viewportScrollLeft(value) {
        this._ref.$viewport.scrollLeft = value;
    }
    _initHoverEvent() {
        this._ref.$canvas.addEventListener('mouseover', e => {
            let $cell = e.target;
            let _$cell;
            while ($cell && $cell !== this._ref.$canvas) {
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
        const columns = this.$host?.columns ?? [];
        this.fixedLeftColumns = columns.filter(column => column.fixedLeft);
        this.fixedRightColumns = columns
            .filter(column => column.fixedRight)
            .reverse();
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
        this._ref.$canvas.innerHTML = '';
        columns.forEach(column => render(column, this._ref.$canvas));
    }
    connectedCallback() {
        super.connectedCallback();
        this.upgradeProperty(['area', 'columns']);
    }
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    static get observedAttributes() {
        return [];
    }
}
if (!customElements.get('bl-table-header')) {
    customElements.define('bl-table-header', BlocksTableHeader);
}
