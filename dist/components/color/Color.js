import { round } from '../../common/utils.js';
const toFloat = 1 / 255;
const EPSILON = 0.000001;
export function clamp(val, min, max) {
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    return val < min ? min : val > max ? max : val;
}
function clampVal(value) {
    value = Math.trunc(value);
    if (value > 4294967296) {
        value = 4294967296;
    }
    else if (value < 0) {
        value = 0;
    }
    return value;
}
class Color {
    static TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));
    static WHITE = Object.freeze(new Color(255, 255, 255, 255));
    static BLACK = Object.freeze(new Color(0, 0, 0, 255));
    static GRAY = Object.freeze(new Color(128, 128, 128, 255));
    static RED = Object.freeze(new Color(255, 0, 0, 255));
    static GREEN = Object.freeze(new Color(0, 255, 0, 255));
    static BLUE = Object.freeze(new Color(0, 0, 255, 255));
    static CYAN = Object.freeze(new Color(0, 255, 255, 255));
    static MAGENTA = Object.freeze(new Color(255, 0, 255, 255));
    static YELLOW = Object.freeze(new Color(255, 255, 0, 255));
    static toValue(r, g, b, a = 255) {
        return ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
    }
    static to8BitAlpha(alpha) {
        return ~~clamp(round(alpha * 255), 0, 255);
    }
    static fromRgb(r, g, b, alpha = 1) {
        return new Color(r, g, b, alpha);
    }
    static fromHex(hexString) {
        hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
        let r;
        let g;
        let b;
        if (hexString.length === 3) {
            r = parseInt(hexString[0] + hexString[0], 16) || 0;
            g = parseInt(hexString[1] + hexString[1], 16) || 0;
            b = parseInt(hexString[2] + hexString[2], 16) || 0;
        }
        else {
            r = parseInt(hexString.substr(0, 2), 16) || 0;
            g = parseInt(hexString.substr(2, 2), 16) || 0;
            b = parseInt(hexString.substr(4, 2), 16) || 0;
        }
        let alpha8bit = parseInt(hexString.substr(6, 2), 16);
        if (Number.isNaN(alpha8bit))
            alpha8bit = 255;
        return new Color(Color.toValue(r, g, b, alpha8bit));
    }
    static fromHsv(h, s, v, alpha = 1) {
        const [r, g, b] = hsv2rgb(h, s, v);
        return Color.fromRgb(round(r), round(g), round(b), alpha);
    }
    static fromHsl(h, s, l, alpha = 1) {
        const hsv = hsl2hsv(h, s, l);
        return Color.fromHsv(...hsv, alpha);
    }
    static equals(a, b, epsilon = EPSILON) {
        return (Math.abs(a.b - b.b) <= epsilon * Math.max(1.0, Math.abs(a.b), Math.abs(b.b)) &&
            Math.abs(a.g - b.g) <= epsilon * Math.max(1.0, Math.abs(a.g), Math.abs(b.g)) &&
            Math.abs(a.r - b.r) <= epsilon * Math.max(1.0, Math.abs(a.r), Math.abs(b.r)) &&
            Math.abs(a.a - b.a) <= epsilon * Math.max(1.0, Math.abs(a.a), Math.abs(b.a)));
    }
    static format(color, fmt = 'rgba') {
        switch (fmt) {
            case 'rgba':
                return `rgba(${color.toRgb().join(',')},${round(color.alpha, 2)})`;
            case 'rgb':
                return `rgb(${color.toRgb().join(',')})`;
            case 'hex':
                fmt = color.a === 255 ? '#rrggbb' : '#rrggbbaa';
            case '#rrggbb':
            case '#rrggbbaa':
            case '#rgb': {
                const [r, g, b] = [color.r, color.g, color.b];
                const prefix = '0';
                const hex = [
                    (r < 16 ? prefix : '') + r.toString(16),
                    (g < 16 ? prefix : '') + g.toString(16),
                    (b < 16 ? prefix : '') + b.toString(16),
                ];
                if (fmt === '#rgb') {
                    hex[0] = hex[0][0];
                    hex[1] = hex[1][0];
                    hex[2] = hex[2][0];
                }
                else if (fmt === '#rrggbbaa') {
                    hex.push((color.a < 16 ? prefix : '') + color.a.toString(16));
                }
                return '#' + hex.join('');
            }
            case 'hsl': {
                const [h, s, l] = color.toHsl();
                return `hsl(${round(h)},${round(s * 100)}%,${round(l * 100)}%)`;
            }
            case 'hsla': {
                const [h, s, l, a] = color.toHsla();
                return `hsl(${round(h)},${round(s * 100)}%,${round(l * 100)}%,${round(a, 2)})`;
            }
            case 'hsv': {
                const [h, s, v] = color.toHsv();
                return `hsv(${round(h)},${round(s * 100)}%,${round(v * 100)}%)`;
            }
            case 'hsva': {
                const [h, s, v, a] = color.toHsva();
                return `hsva(${round(h)},${round(s * 100)}%,${round(v * 100)}%,${round(a, 2)})`;
            }
            default:
                return `rgba(${color.toRgb().join(',')},${round(color.alpha, 2)})`;
        }
    }
    get value() {
        return this._val;
    }
    set value(value) {
        value = clampVal(value);
        this._val = value;
        this._alpha = ((value & 0xff000000) >>> 24) * toFloat;
    }
    get r() {
        return this._val & 0x000000ff;
    }
    set r(red) {
        red = ~~clamp(red, 0, 255);
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
    }
    get g() {
        return (this._val & 0x0000ff00) >> 8;
    }
    set g(green) {
        green = ~~clamp(green, 0, 255);
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
    }
    get b() {
        return (this._val & 0x00ff0000) >> 16;
    }
    set b(blue) {
        blue = ~~clamp(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }
    get a() {
        return (this._val & 0xff000000) >>> 24;
    }
    set a(alpha) {
        alpha = ~~clamp(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0;
        this._alpha = alpha * toFloat;
    }
    get alpha() {
        return this._alpha;
    }
    set alpha(alpha) {
        this._alpha = alpha;
        this._val = ((this._val & 0x00ffffff) | (Color.to8BitAlpha(alpha) << 24)) >>> 0;
    }
    constructor(r, g, b, alpha) {
        if (typeof r === 'string') {
            return Color.fromHex(r);
        }
        else if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
            alpha = alpha ?? 1;
            this._val = Color.toValue(r, g, b, Color.to8BitAlpha(alpha));
            this._alpha = alpha;
        }
        else if (typeof r === 'number') {
            this._val = clampVal(r || 0);
            this._alpha = this.a * toFloat;
        }
        else {
            this._val = 0;
            this._alpha = this.a * toFloat;
        }
    }
    equals(other) {
        return this === other || this._val === other._val;
    }
    toString(fmt = 'rgba') {
        return Color.format(this, fmt);
    }
    toRgb() {
        return [this.r, this.g, this.b];
    }
    toRgba() {
        return [this.r, this.g, this.b, this.alpha];
    }
    toHsv() {
        return rgb2hsv(this.r, this.g, this.b);
    }
    toHsva() {
        return this.toHsv().concat(this.alpha);
    }
    toHsl() {
        return hsv2hsl(...this.toHsv());
    }
    toHsla() {
        return this.toHsl().concat(this.alpha);
    }
}
export { Color };
function hsv2rgb(h, s, v) {
    const C = v * s;
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - C;
    const [r, g, b] = h >= 0 && h <= 60
        ? [C + m, X + m, m]
        : h > 60 && h <= 120
            ? [X + m, C + m, m]
            : h > 120 && h <= 180
                ? [m, C + m, X + m]
                : h > 180 && h <= 240
                    ? [m, X + m, C + m]
                    : h > 240 && h <= 300
                        ? [X + m, m, C + m]
                        : h > 300 && h <= 360
                            ? [C + m, m, X + m]
                            : [m, m, m];
    return [r * 255, g * 255, b * 255];
}
function rgb2hsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const delta = M - m;
    const v = M;
    let h;
    if (delta === 0) {
        h = 0;
    }
    else if (M === r) {
        h = 60 * (((g - b) / delta) % 6);
    }
    else if (M === g) {
        h = 60 * ((b - r) / delta + 2);
    }
    else if (M === b) {
        h = 60 * ((r - g) / delta + 4);
    }
    if (h < 0)
        h += 360;
    let s;
    if (M === 0) {
        s = 0;
    }
    else {
        s = delta / M;
    }
    return [h, s, v];
}
function hsv2hsl(Hv, Sv, V) {
    const Hl = Hv;
    const L = V * (1 - Sv / 2);
    const Sl = L === 0 || L === 1 ? 0 : (V - L) / Math.min(L, 1 - L);
    return [Hl, Sl, L];
}
function hsl2hsv(Hl, Sl, L) {
    const Hv = Hl;
    const V = L + Sl * Math.min(L, 1 - L);
    const Sv = V === 0 ? 0 : 2 * (1 - L / V);
    return [Hv, Sv, V];
}
