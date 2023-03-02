import { dispatchEvent } from '../../common/event.js';
import { enumGetter, enumSetter, intGetter, intSetter, } from '../../common/property.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { round } from '../../common/utils.js';
import { parse } from '../../common/color.js';
import { onDragMove } from '../../common/onDragMove.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
import { Color } from './Color.js';
export class BlocksColor extends Component {
    static get observedAttributes() {
        return ['mode', 'value'];
    }
    _lastHue = 0;
    _color = Color.fromRgb(255, 0, 0);
    get _alpha() {
        return this._color.alpha;
    }
    _clearResizeHandler;
    _dragging = false;
    _preventUpdateControl = false;
    _preventUpdateModel = false;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        const $layout = shadowRoot.getElementById('layout');
        const $hsv = shadowRoot.getElementById('hsv-picker');
        const $result = shadowRoot.getElementById('result');
        const $hueBar = shadowRoot.getElementById('hue-bar');
        const $alphaBar = shadowRoot.getElementById('alpha-bar');
        const $hsvHue = $hsv.querySelector('.hue');
        const $hsvButton = $hsv.querySelector('button');
        const $hueButton = $hueBar.querySelector('button');
        const $alphaButton = $alphaBar.querySelector('button');
        const $alphaBarBg = $alphaBar.querySelector('.bg');
        const $resultBg = $result.querySelector('.bg');
        const $modeContent = shadowRoot.getElementById('mode-content');
        const $modeSwitch = shadowRoot.getElementById('mode-switch');
        this._ref = {
            $layout,
            $hsv,
            $result,
            $hueBar,
            $alphaBar,
            $hsvHue,
            $hsvButton,
            $hueButton,
            $alphaButton,
            $alphaBarBg,
            $resultBg,
            $modeContent,
            $modeSwitch,
        };
        this._initPickEvents();
        this._initModeChangeEvent();
        this._initInputEvents();
    }
    get value() {
        return intGetter('value')(this);
    }
    set value(value) {
        intSetter('value')(this, value);
    }
    get mode() {
        return enumGetter('mode', ['hex', 'rgb', 'hsl', 'hsv'])(this) ?? 'hex';
    }
    set mode(value) {
        enumSetter('mode', ['hex', 'rgb', 'hsl', 'hsv'])(this, value);
    }
    get hex() {
        return this._color.toString('hex');
    }
    set hex(value) {
        const newColor = Color.fromHex(value);
        const [h, s, v, alpha] = newColor.toHsva();
        this._setStates(h, s, v, alpha);
    }
    get rgb() {
        return this._color.toRgb();
    }
    set rgb([r, g, b]) {
        const newColor = Color.fromRgb(r, g, b);
        const [h, s, v] = newColor.toHsv();
        this._setStates(h, s, v, this._alpha);
    }
    get rgba() {
        return this._color.toRgba();
    }
    set rgba([r, g, b, a]) {
        const newColor = Color.fromRgb(r, g, b, a);
        const [h, s, v] = newColor.toHsv();
        this._setStates(h, s, v, a);
    }
    get hsl() {
        return this._color.toHsl();
    }
    set hsl([hl, sl, l]) {
        const newColor = Color.fromHsl(hl, sl, l);
        const [hv, sv, v] = newColor.toHsv();
        this._setStates(hv, sv, v, this._alpha);
    }
    get hsla() {
        return this._color.toHsla();
    }
    set hsla([hl, sl, l, a]) {
        const newColor = Color.fromHsl(hl, sl, l, a);
        const [hv, sv, v, a2] = newColor.toHsva();
        this._setStates(hv, sv, v, a2);
    }
    get hsv() {
        return this._color.toHsv();
    }
    set hsv([h, s, v]) {
        this._setStates(h, s, v, this._alpha);
    }
    get hsva() {
        return this._color.toHsva();
    }
    set hsva([h, s, v, a]) {
        this._setStates(h, s, v, a);
    }
    connectedCallback() {
        super.connectedCallback();
        this._clearResizeHandler = sizeObserve(this._ref.$layout, this._updateControls.bind(this));
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._clearResizeHandler) {
            this._clearResizeHandler();
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'mode') {
            this.render();
        }
        if (attrName === 'value') {
            if (oldValue === newValue) {
                return;
            }
            const newColor = new Color(+newValue);
            const [h, s, l, v] = newColor.toHsva();
            this._setStates(h, s, l, v);
            this.render();
        }
    }
    render() {
        this._updateControls();
        this._updateBg();
        this._updateModels();
    }
    format(fmt) {
        return this._color.toString(fmt);
    }
    _updateControls() {
        if (this._preventUpdateControl)
            return;
        const [_hue, _saturation, _value, _alpha] = this._color.toHsva();
        const alphaBarWidth = this._ref.$alphaBar.clientWidth - 12;
        const alphaX = _alpha * alphaBarWidth;
        this._ref.$alphaButton.style.left = alphaX + 'px';
        const hueBarWidth = this._ref.$hueBar.clientWidth - 12;
        const hueX = (_hue / 360) * hueBarWidth;
        this._ref.$hueButton.style.left = hueX + 'px';
        const width = this._ref.$hsv.clientWidth - 12;
        const height = this._ref.$hsv.clientHeight - 12;
        const x = _saturation * width;
        const y = height - _value * height;
        this._ref.$hsvButton.style.top = y + 'px';
        this._ref.$hsvButton.style.left = x + 'px';
    }
    _setStates(hue, saturation, value, alpha) {
        if (saturation === 0) {
            hue = this._lastHue;
        }
        else {
            this._lastHue = hue;
        }
        const color = Color.fromHsv(hue, saturation, value, alpha);
        const changed = !Color.equals(this._color, color);
        this._color = color;
        if (changed) {
            this.value = color.value;
            const payload = { detail: { value: this.value } };
            dispatchEvent(this, 'bl:color:change', payload);
            dispatchEvent(this, 'change', payload);
        }
        return changed;
    }
    _updateState() {
        const alphaBarWidth = this._ref.$alphaBar.clientWidth - 12;
        const alphaX = parseInt(getComputedStyle(this._ref.$alphaButton).left, 10) || 0;
        const alpha = alphaX / alphaBarWidth;
        const hueBarWidth = this._ref.$hueBar.clientWidth - 12;
        const hueX = parseInt(getComputedStyle(this._ref.$hueButton).left, 10) || 0;
        const hue = Math.floor(360 * (hueX / hueBarWidth));
        const width = this._ref.$hsv.clientWidth - 12;
        const height = this._ref.$hsv.clientHeight - 12;
        const x = parseInt(getComputedStyle(this._ref.$hsvButton).left, 10) || 0;
        const y = parseInt(getComputedStyle(this._ref.$hsvButton).top, 10) || 0;
        const saturation = Math.floor(100 * (x / width)) / 100;
        const value = 1 - Math.floor(100 * (y / height)) / 100;
        return this._setStates(hue, saturation, value, alpha);
    }
    _updateBg() {
        const bg = `hsl(${this._lastHue}, 100%, 50%)`;
        this._ref.$hsvHue.style.backgroundColor = bg;
        this._ref.$alphaBarBg.style.backgroundImage = `linear-gradient(to right, transparent, ${bg})`;
        const resultBg = this.hsla;
        this._ref.$resultBg.style.backgroundColor = `hsla(${this._lastHue},${resultBg[1] * 100}%,${resultBg[2] * 100}%,${resultBg[3]})`;
    }
    _updateModels() {
        if (this._preventUpdateModel)
            return;
        const mode = this.mode;
        const children = Array.prototype.slice.call(this._ref.$modeContent.children);
        const inputs = children.map($el => $el.querySelector('input'));
        const spans = children.map($el => $el.querySelector('span'));
        if (mode === 'hex') {
            children.forEach(($el, index) => ($el.style.display = index === 0 ? '' : 'none'));
            children[0].querySelector('input').value = this.hex;
            spans[0].textContent = 'HEX';
        }
        else if (mode === 'rgb') {
            const rgba = this.rgba;
            children.forEach($el => ($el.style.display = ''));
            inputs[0].value = rgba[0];
            inputs[1].value = rgba[1];
            inputs[2].value = rgba[2];
            inputs[3].value = round(this._alpha, 2);
            spans[0].textContent = 'R';
            spans[1].textContent = 'G';
            spans[2].textContent = 'B';
            spans[3].textContent = 'A';
        }
        else if (mode === 'hsv') {
            const hsv = this.hsv;
            children.forEach($el => ($el.style.display = ''));
            inputs[0].value = Math.round(hsv[0] % 360);
            inputs[1].value = Math.round(hsv[1] * 100) + '%';
            inputs[2].value = Math.round(hsv[2] * 100) + '%';
            inputs[3].value = round(this._alpha, 2);
            spans[0].textContent = 'H';
            spans[1].textContent = 'S';
            spans[2].textContent = 'V';
            spans[3].textContent = 'A';
        }
        else if (mode === 'hsl') {
            const hsla = this.hsla;
            children.forEach($el => ($el.style.display = ''));
            inputs[0].value = Math.round(hsla[0] % 360);
            inputs[1].value = Math.round(hsla[1] * 100) + '%';
            inputs[2].value = Math.round(hsla[2] * 100) + '%';
            inputs[3].value = round(this._alpha, 2);
            spans[0].textContent = 'H';
            spans[1].textContent = 'S';
            spans[2].textContent = 'L';
            spans[3].textContent = 'A';
        }
    }
    _initModeChangeEvent() {
        this._ref.$modeSwitch.onclick = () => {
            const modes = ['hex', 'rgb', 'hsl', 'hsv'];
            const mode = modes[(modes.indexOf(this.mode) + 1) % 4];
            this.mode = mode;
        };
    }
    _initInputEvents() {
        this._ref.$modeContent.onchange = e => {
            const $input = e.target;
            const value = $input.value || '';
            const mode = this.mode;
            if (mode === 'hex') {
                const rgba = parse(value);
                if (rgba) {
                    this._preventUpdateModel = true;
                    this.rgba = rgba;
                    this._preventUpdateModel = false;
                }
            }
            else if (mode === 'rgb') {
                const values = Array.prototype.map.call(this._ref.$modeContent.querySelectorAll('input'), $input => Number($input.value));
                if (values.every(n => n >= 0 && n <= 255)) {
                    this._preventUpdateModel = true;
                    this.rgba = values;
                    this._preventUpdateModel = false;
                }
            }
            else if (mode === 'hsv') {
                const values = Array.prototype.map.call(this._ref.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value));
                if (values[0] < 0 || values[0] > 360)
                    return;
                if (values[1] < 0 || values[1] > 100)
                    return;
                if (values[2] < 0 || values[2] > 100)
                    return;
                if (values[3] < 0 || values[3] > 1)
                    return;
                this._preventUpdateModel = true;
                this.hsva = [values[0], values[1] / 100, values[2] / 100, values[3]];
                this._preventUpdateModel = false;
            }
            else if (mode === 'hsl') {
                const values = Array.prototype.map.call(this._ref.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value));
                if (values[0] < 0 || values[0] > 360)
                    return;
                if (values[1] < 0 || values[1] > 100)
                    return;
                if (values[2] < 0 || values[2] > 100)
                    return;
                if (values[3] < 0 || values[3] > 1)
                    return;
                this._preventUpdateModel = true;
                this.hsla = [values[0], values[1] / 100, values[2] / 100, values[3]];
                this._preventUpdateModel = false;
            }
        };
    }
    _initPickEvents() {
        this._dragging = false;
        let $button = null;
        let wrapWidth = null;
        let wrapHeight = null;
        let positionStart = null;
        const update = () => {
            this._preventUpdateControl = true;
            this._updateState();
            this._preventUpdateControl = false;
        };
        const onMove = ({ offset, preventDefault }) => {
            preventDefault();
            let x = positionStart.x + offset.x;
            let y = positionStart.y + offset.y;
            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0;
            if (x > wrapWidth - 12)
                x = wrapWidth - 12;
            if (y > wrapHeight - 12)
                y = wrapHeight - 12;
            $button.style.left = x + 'px';
            $button.style.top = y + 'px';
            update();
        };
        const onEnd = () => {
            update();
            positionStart = null;
            wrapWidth = null;
            wrapHeight = null;
            this._dragging = false;
        };
        const onStart = ({ start, $target }) => {
            this._dragging = true;
            const $wrap = [
                this._ref.$hueBar,
                this._ref.$alphaBar,
                this._ref.$hsv,
            ].find($wrap => $wrap.contains($target));
            $button = $wrap.querySelector('button');
            const rect = $wrap.getBoundingClientRect();
            wrapWidth = rect.width;
            wrapHeight = rect.height;
            let x = start.clientX - rect.x - 6;
            let y = start.clientY - rect.y - 6;
            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0;
            if (x > wrapWidth - 12)
                x = wrapWidth - 12;
            if (y > wrapHeight - 12)
                y = wrapHeight - 12;
            positionStart = { x, y };
            $button.style.left = x + 'px';
            $button.style.top = y + 'px';
            update();
        };
        const options = {
            onStart,
            onMove,
            onEnd,
        };
        onDragMove(this._ref.$hueBar, options);
        onDragMove(this._ref.$alphaBar, options);
        onDragMove(this._ref.$hsv, options);
    }
}
if (!customElements.get('bl-color')) {
    customElements.define('bl-color', BlocksColor);
}
