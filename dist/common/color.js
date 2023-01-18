export function hsv2rgb(h, s, v) {
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
export function rgb2hsv(r, g, b) {
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
export function hsv2hsl(Hv, Sv, V) {
    const Hl = Hv;
    const L = V * (1 - Sv / 2);
    const Sl = L === 0 || L === 1 ? 0 : (V - L) / Math.min(L, 1 - L);
    return [Hl, Sl, L];
}
export function hsl2hsv(Hl, Sl, L) {
    const Hv = Hl;
    const V = L + Sl * Math.min(L, 1 - L);
    const Sv = V === 0 ? 0 : 2 * (1 - L / V);
    return [Hv, Sv, V];
}
export function hex2rgba(hex) {
    if (!hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/))
        return null;
    hex = hex.replace('#', '');
    const rgba = Array(4);
    rgba[3] = 255;
    if (hex.length === 3) {
        hex.split('').forEach((ch, index) => {
            rgba[index] = parseInt(ch + ch, 16);
        });
    }
    else {
        let i = 0;
        let index = 0;
        const len = hex.length;
        for (; i < len; i += 2) {
            rgba[index] = parseInt(hex.substr(i, 2), 16);
            index += 1;
        }
    }
    rgba[3] = rgba[3] / 255;
    return rgba;
}
export function rgba2hex(rgba) {
    let hex = '#';
    let i = 0;
    const len = rgba.length;
    if (len !== 3 && len !== 4) {
        return null;
    }
    for (; i < len; i += 1) {
        if (i === 3) {
            if (rgba[i] !== 1) {
                const n = Math.round(rgba[i] * 255).toString(16);
                hex += n.length === 1 ? '0' + n : n;
            }
        }
        else {
            const n = Math.round(rgba[i]).toString(16);
            hex += n.length === 1 ? '0' + n : n;
        }
    }
    return hex;
}
export const parse = (() => {
    return function parse(input) {
        input = (input ?? '').trim();
        if (!input.length)
            return null;
        return getParseFn(input)?.(input) ?? null;
    };
    function getParseFn(input) {
        if (!input.length)
            return;
        if (input.startsWith('#'))
            return parseHex;
        if (/^rgba?\([,0-9\s\.]+\)$/.test(input)) {
            return parseRgba;
        }
        if (/^hsv\([,0-9\s%]+\)$/.test(input)) {
            return parseHsv;
        }
        if (/^hsla?\([,0-9\s\.%]+\)$/.test(input)) {
            return parseHsl;
        }
        return () => null;
    }
    function parseRgba(input) {
        const isRgba = input.startsWith('rgba(');
        const start = isRgba ? 5 : 4;
        const end = input.length - 1;
        const valueStr = input.slice(start, end);
        const rgba = valueStr.split(/\s*,\s*/).map(str => parseFloat(str));
        if (isRgba && rgba.length !== 4) {
            return null;
        }
        if (!isRgba && rgba.length !== 3) {
            return null;
        }
        const [r, g, b, a] = rgba;
        if (r < 0 || r > 255) {
            return null;
        }
        if (g < 0 || g > 255) {
            return null;
        }
        if (b < 0 || b > 255) {
            return null;
        }
        if (isRgba && (a < 0 || a > 1)) {
            return null;
        }
        if (!isRgba)
            rgba.push(1);
        return rgba;
    }
    function parseHex(input) {
        return hex2rgba(input);
    }
    function parseHsl(input) {
        const isHsla = input.startsWith('hsla(');
        const start = isHsla ? 5 : 4;
        const end = input.length - 1;
        const valueStr = input.slice(start, end);
        const hsla = valueStr.split(/\s*,\s*/).map(str => parseFloat(str));
        if (isHsla && hsla.length !== 4)
            return null;
        if (!isHsla && hsla.length !== 3)
            return null;
        const [h, s, l, a] = hsla;
        if (h < 0 || h > 360)
            return null;
        if (s < 0 || s > 100)
            return null;
        if (l < 0 || l > 100)
            return null;
        if (isHsla && (a < 0 || a > 1))
            return null;
        const hsv = hsl2hsv(h, s / 100, l / 100);
        const rgb = hsv2rgb(...hsv);
        return [...rgb, isHsla ? a : 1];
    }
    function parseHsv(input) {
        const valueStr = input.slice(4, input.length - 1);
        const hsv = valueStr.split(/\s*,\s*/).map(str => parseInt(str, 10));
        if (hsv.length !== 3)
            return null;
        const [h, s, v] = hsv;
        if (h < 0 || h > 360)
            return null;
        if (s < 0 || s > 100)
            return null;
        if (v < 0 || v > 100)
            return null;
        const rgb = hsv2rgb(h, s / 100, v / 100);
        return [...rgb, 1];
    }
})();
export function rgbaFromHex(hexColor, opacity) {
    return `rgba(${hex2rgba(hexColor).concat([opacity]).join(',')})`;
}
export function useColorWithOpacity(color, opacity) {
    const rgba = parse(color);
    if (rgba) {
        return `rgba(${rgba[0]},${rgba[0]},${rgba[0]},${opacity})`;
    }
    console.warn('Invalid color: ', color);
    return '';
}
;
window.rgb2hsv = rgb2hsv;
window.hsv2rgb = hsv2rgb;
