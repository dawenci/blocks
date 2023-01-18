import { getRegisteredSvgIcon } from '../../icon/store.js';
import { forEach } from '../../common/utils.js';
import { boolGetter, boolSetter, enumGetter, enumSetter, } from '../../common/property.js';
import { clearableGetter, clearableSetter, } from '../../common/propertyAccessor.js';
import { Component } from '../Component.js';
import { template } from './template.js';
const halfValueGetter = enumGetter('value', [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
]);
const halfValueSetter = enumSetter('value', [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
]);
const valueGetter = enumGetter('value', ['1', '2', '3', '4', '5']);
const valueSetter = enumSetter('value', ['1', '2', '3', '4', '5']);
const halfGetter = boolGetter('half');
const halfSetter = boolSetter('half');
const $STAR_ICON = getRegisteredSvgIcon('star');
export class BlocksRate extends Component {
    ref;
    _hoverValue;
    static get observedAttributes() {
        return [
            'value',
            'half',
            'clearable',
            'result-mode',
        ];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        const $layout = shadowRoot.getElementById('layout');
        this.ref = { $layout };
        forEach($layout.children, ($button, index) => {
            $button.onmouseover = e => {
                if (this.resultMode)
                    return;
                if (!this.half) {
                    this._hoverValue = index + 1;
                }
                else {
                    let el = e.target;
                    while (!el.classList.contains('star')) {
                        el = el.parentElement;
                    }
                    this._hoverValue = index + (el.classList.contains('part') ? 0.5 : 1);
                }
                this.updateSelect();
            };
            $button.onclick = e => {
                if (this.resultMode)
                    return;
                if (!this.half) {
                    this.value = index + 1;
                }
                else {
                    let el = e.target;
                    while (!el.classList.contains('star')) {
                        el = el.parentElement;
                    }
                    this.value = index + (el.classList.contains('part') ? 0.5 : 1);
                }
                this.updateSelect();
            };
        });
        $layout.onmouseleave = e => {
            this._hoverValue = undefined;
            this.updateSelect();
        };
    }
    get clearable() {
        return clearableGetter(this);
    }
    set clearable(value) {
        clearableSetter(this, value);
    }
    get value() {
        const value = this.resultMode
            ? this.getAttribute('value')
            : this.half
                ? halfValueGetter(this)
                : valueGetter(this);
        if (value == null)
            return null;
        return +value;
    }
    set value(value) {
        if (this.resultMode) {
            this.setAttribute('value', value);
        }
        if (this.half) {
            halfValueSetter(this, '' + value);
        }
        else {
            valueSetter(this, '' + value);
        }
    }
    get half() {
        return halfGetter(this);
    }
    set half(value) {
        halfSetter(this, value);
    }
    get resultMode() {
        return boolGetter('result-mode')(this);
    }
    set resultMode(value) {
        boolSetter('result-mode')(this, value);
    }
    updateSelect() {
        if (this.resultMode) {
            const value = this.value ?? 0;
            let acc = 0;
            forEach(this.ref.$layout.children, $button => {
                if (value - acc >= 1) {
                    $button.className = 'selected';
                    acc += 1;
                }
                else if (value - acc > 0) {
                    $button.className = 'partially-selected';
                    const n = value - acc;
                    $button.querySelector('.part').style.width = `${n * 100}%`;
                    acc += n;
                }
                else {
                    $button.className = '';
                }
            });
            return;
        }
        const value = +(this._hoverValue ?? this.value ?? 0);
        let acc = 0;
        forEach(this.ref.$layout.children, $button => {
            if (value - acc >= 1) {
                $button.className = 'selected';
                acc += 1;
            }
            else if (value - acc === 0.5) {
                $button.className = 'partially-selected';
                $button.querySelector('.part').style.width = '';
                acc += 0.5;
            }
            else {
                $button.className = '';
            }
        });
    }
    render() {
        const star = document.createElement('span');
        star.className = 'star';
        star.appendChild($STAR_ICON.cloneNode(true));
        forEach(this.ref.$layout.children, $button => {
            if ($button.children.length !== 2) {
                $button.innerHTML = '';
                $button.appendChild(star.cloneNode(true));
                $button
                    .appendChild(star.cloneNode(true))
                    .classList.add('part');
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.updateSelect();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
        this.updateSelect();
    }
}
if (!customElements.get('bl-rate')) {
    customElements.define('bl-rate', BlocksRate);
}
