import '../icon/index.js';
import { dispatchEvent } from '../../common/event.js';
import { intGetter, intSetter } from '../../common/property.js';
import { disabledGetter, disabledSetter, sizeGetter, sizeSetter, } from '../../common/propertyAccessor.js';
import { forEach } from '../../common/utils.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
export class BlocksPagination extends Component {
    static get observedAttributes() {
        return [
            'current',
            'disabled',
            'page-size',
            'page-sizes',
            'order',
            'size',
            'total',
        ];
    }
    _itemPool = [];
    constructor() {
        super();
        const { comTemplate } = template();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(comTemplate.content.cloneNode(true));
        const $pager = shadowRoot.getElementById('pager');
        const $items = shadowRoot.getElementById('items');
        const $prev = shadowRoot.getElementById('prev');
        const $next = shadowRoot.getElementById('next');
        const $jump = shadowRoot.getElementById('jump');
        const $sizes = shadowRoot.getElementById('sizes');
        const $total = shadowRoot.getElementById('total');
        this._ref = {
            $pager,
            $items,
            $prev,
            $next,
            $jump,
            $sizes,
            $total,
        };
        $prev.onclick = () => this._prev();
        $next.onclick = () => this._next();
        $items.onclick = e => {
            if (this.disabled)
                return;
            let $button = e.target;
            if ($button.tagName === 'BL-ICON') {
                $button = $button.parentElement;
            }
            if ($button.tagName !== 'BUTTON')
                return;
            if ($button.classList.contains('quick-prev')) {
                return this._quickPrev();
            }
            else if ($button.classList.contains('quick-next')) {
                return this._quickNext();
            }
            this.current = +$button.textContent;
        };
    }
    get current() {
        return intGetter('current')(this) ?? 1;
    }
    set current(value) {
        intSetter('current')(this, value);
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    get pageSize() {
        return intGetter('page-size')(this) ?? 10;
    }
    set pageSize(value) {
        intSetter('page-size')(this, value);
    }
    get pageSizes() {
        return this.getAttribute('page-sizes');
    }
    set pageSizes(value) {
        this.setAttribute('page-sizes', value);
    }
    get showQuickJumper() {
        return;
    }
    get showSizeChanger() {
        return;
    }
    get showTotal() {
        return;
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
    get total() {
        return intGetter('total')(this) ?? 0;
    }
    set total(value) {
        intSetter('total')(this, value);
    }
    get itemCount() {
        return Math.ceil(this.total / this.pageSize);
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
        if (attrName === 'current') {
            dispatchEvent(this, 'bl:pagination:current-change', {
                detail: { current: this.current },
            });
        }
        if (attrName === 'page-size') {
            dispatchEvent(this, 'bl:pagination:page-size-change', {
                detail: { pageSize: this.pageSize },
            });
        }
    }
    render() {
        this._renderPager();
        this._ref.$prev.disabled = this.current === 1;
        this._ref.$next.disabled = this.current === this.itemCount;
    }
    _renderPager() {
        const showQuickPrev = this.current > 4;
        const showQuickNext = this.itemCount - this.current > 3;
        const count = this.itemCount < 8
            ? this.itemCount
            : showQuickPrev && showQuickNext
                ? 9
                : 8;
        this._ensureItem(count);
        const children = this._ref.$items.children;
        forEach(children, $item => {
            if ($item.classList.contains('current')) {
                $item.classList.remove('current');
            }
            if ($item.classList.contains('quick-prev')) {
                $item.classList.remove('quick-prev');
                $item.innerHTML = '';
            }
            if ($item.classList.contains('quick-next')) {
                $item.classList.remove('quick-next');
                $item.innerHTML = '';
            }
        });
        if (this.itemCount < 8) {
            this._ensureItem(this.itemCount);
            forEach(children, ($item, index) => {
                const num = index + 1;
                setTextContent($item, num);
                $item.classList.toggle('current', num === this.current);
            });
            return;
        }
        if (!showQuickPrev) {
            for (let i = 0; i < 6; i += 1) {
                const num = i + 1;
                setTextContent(children[i], num);
            }
            children[6].classList.add('quick-next');
            children[6].innerHTML = '<bl-icon value="more"></bl-icon>';
            setTextContent(children[7], this.itemCount);
        }
        else if (!showQuickNext) {
            for (let i = 0; i < 6; i += 1) {
                const num = this.itemCount - i;
                setTextContent(children[count - (i + 1)], num);
            }
            setTextContent(children[0], 1);
            children[1].classList.add('quick-prev');
            children[1].innerHTML = '<bl-icon value="more"></bl-icon>';
        }
        else {
            setTextContent(children[0], 1);
            children[1].classList.add('quick-prev');
            children[1].innerHTML = '<bl-icon value="more"></bl-icon>';
            setTextContent(children[2], this.current - 2);
            setTextContent(children[3], this.current - 1);
            setTextContent(children[4], this.current);
            setTextContent(children[5], this.current + 1);
            setTextContent(children[6], this.current + 2);
            children[7].classList.add('quick-next');
            children[7].innerHTML = '<bl-icon value="more"></bl-icon>';
            setTextContent(children[8], this.itemCount);
        }
        forEach(children, $item => {
            const current = parseInt($item.textContent);
            $item.classList.toggle('current', current === this.current);
        });
    }
    _ensureItem(n) {
        const { itemTemplate } = template();
        while (this._ref.$items.children.length < n) {
            this._ref.$items.appendChild(this._itemPool.pop() ?? itemTemplate.cloneNode(true));
        }
        while (this._ref.$items.children.length > n) {
            this._itemPool.push(this._ref.$items.removeChild(this._ref.$items.lastElementChild));
        }
        if (this._itemPool.length > 7)
            this._itemPool.length = 7;
    }
    _prev() {
        if (this.disabled || this.current === 1)
            return;
        this.current -= 1;
    }
    _next() {
        if (this.disabled || this.current === this.itemCount)
            return;
        this.current += 1;
    }
    _quickPrev() {
        const num = this.current - 5;
        this.current = num >= 1 ? num : 1;
    }
    _quickNext() {
        const num = this.current + 5;
        this.current = num <= this.itemCount ? num : this.itemCount;
    }
}
if (!customElements.get('bl-pagination')) {
    customElements.define('bl-pagination', BlocksPagination);
}
function setTextContent(element, value) {
    element.textContent = value;
}
