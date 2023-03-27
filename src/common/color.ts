type ColorTuple3 = [number, number, number]
type ColorTuple4 = [number, number, number, number]

/**
 *
 * HSV 转 RGB
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param {number} h hue(0 - 360)
 * @param {number} s saturation(0 - 1)
 * @param {number} v value(0 - 1)
 */
export function hsv2rgb(h: number, s: number, v: number): ColorTuple3 {
  // chroma
  const C = v * s
  // an intermediate value used for computing the RGB model
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
  // the RGB component with the smalles value
  const m = v - C

  // 色环中按 60 度分段，当前落在哪一段
  const [r, g, b] =
    h >= 0 && h <= 60
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
      : [m, m, m]

  // 计算出的 r，g，b 取值为 0 - 1，转换成 0 - 255 输出
  return [r * 255, g * 255, b * 255]
}

/**
 * RGB 转 HSV
 * https://www.rapidtables.com/convert/color/rgb-to-hsv.html
 *
 * @export
 * @param {number} r red(0 - 255)
 * @param {number} g green(0 - 255)
 * @param {number} b blue(0 - 255)
 * @returns
 */
export function rgb2hsv(r: number, g: number, b: number): ColorTuple3 {
  // 0 - 255，转换成 0 - 1
  r = r / 255
  g = g / 255
  b = b / 255

  // the RGB component with the greatest value
  const M = Math.max(r, g, b)
  // the RGB component with the smalles value
  const m = Math.min(r, g, b)
  // chroma
  const delta = M - m
  const v = M

  let h: number
  if (delta === 0) {
    h = 0
  } else if (M === r) {
    h = 60 * (((g - b) / delta) % 6)
  } else if (M === g) {
    h = 60 * ((b - r) / delta + 2)
  } else if (M === b) {
    h = 60 * ((r - g) / delta + 4)
  }

  if (h! < 0) h! += 360

  let s
  if (M === 0) {
    s = 0
  } else {
    s = delta / M
  }

  return [h!, s, v]
}

/**
 *
 * HSV 转 HSL
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param {number} Hv 0 - 360
 * @param {number} Sv 0 - 1
 * @param {number} V 0 - 1
 */
export function hsv2hsl(Hv: number, Sv: number, V: number): ColorTuple3 {
  const Hl = Hv
  const L = V * (1 - Sv / 2)
  const Sl = L === 0 || L === 1 ? 0 : (V - L) / Math.min(L, 1 - L)
  return [Hl, Sl, L]
}

/**
 *
 * HSL 转 HSV
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param {number} Hl 0 - 360
 * @param {number} Sl 0 - 1
 * @param {number} L 0 - 1
 */
export function hsl2hsv(Hl: number, Sl: number, L: number): ColorTuple3 {
  const Hv = Hl
  const V = L + Sl * Math.min(L, 1 - L)
  const Sv = V === 0 ? 0 : 2 * (1 - L / V)
  return [Hv, Sv, V]
}

/**
 * 十六进制颜色转换成 rgba 数组
 * #fff -> [255,255,255,1]
 * #ffffff -> [255,255,255,1]
 * #ffffffff -> [255,255,255,1]
 * #ffffff80 -> [255,255,255,0.5]
 *
 * @export
 * @param {string} hex
 * @returns {[number, number, number, number] | null}
 */
export function hex2rgba(hex: string): ColorTuple4 | null {
  if (!hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/)) return null
  hex = hex.replace('#', '')
  const rgba = Array(4) as ColorTuple4
  rgba[3] = 255

  if (hex.length === 3) {
    hex.split('').forEach((ch, index) => {
      rgba[index] = parseInt(ch + ch, 16)
    })
  } else {
    let i = 0
    let index = 0
    const len = hex.length
    for (; i < len; i += 2) {
      rgba[index] = parseInt(hex.substr(i, 2), 16)
      index += 1
    }
  }
  rgba[3] = rgba[3] / 255

  return rgba
}

/**
 * rgba 数组转十六进制
 * [255,255,255] 转成 #ffffff 形式
 * [255,255,255,1] 转成 #ffffff 形式（alpha 1 的时候，省略）
 * [255,255,255,0.5] 转成 #ffffff80 形式（alpha 非 1，转换）
 *
 * @export
 * @param {[number, number, number] | [number, number, number, number] | null} rgba
 * @returns {string}
 */
export function rgba2hex(rgba: ColorTuple3 | ColorTuple4): string | null {
  let hex = '#'
  let i = 0
  const len = rgba.length
  if (len !== 3 && len !== 4) {
    return null
  }
  for (; i < len; i += 1) {
    if (i === 3) {
      if (rgba[i] !== 1) {
        const n = Math.round((rgba[i] as number) * 255).toString(16)
        hex += n.length === 1 ? '0' + n : n
      }
    } else {
      const n = Math.round(rgba[i]).toString(16)
      hex += n.length === 1 ? '0' + n : n
    }
  }
  return hex
}

/**
 * 输入颜色字符串，输出 rgba 数组
 * rgb(255,255,255) -> [255,255,255,1]
 * rgba(255,255,255,0.5) -> [255,255,255,0.5]
 * #fff -> [255,255,255,1]
 * #ffffff -> [255,255,255,1]
 * #ffffff80 -> [255,255,255,0.5]
 * hsl(0, 100, 50) -> [255,0,0,1]
 * hsla(0, 100, 50, 1) -> [255,0,0,1]
 * hsv(0, 100, 100) -> [255,0,0,1]
 *
 * @export
 * @param {string} input
 * @returns {[number, number, number, number] | null}
 */
export const parse: (input: string) => ColorTuple4 | null = (() => {
  return function parse(input) {
    input = (input ?? '').trim()
    if (!input.length) return null
    return getParseFn(input)?.(input) ?? null
  }

  function getParseFn(input: string): undefined | (() => void) | ((input: string) => ColorTuple4 | null) {
    if (!input.length) return
    if (input.startsWith('#')) return parseHex
    if (/^rgba?\([,0-9\s\.]+\)$/.test(input)) {
      return parseRgba
    }
    if (/^hsv\([,0-9\s%]+\)$/.test(input)) {
      return parseHsv
    }
    if (/^hsla?\([,0-9\s\.%]+\)$/.test(input)) {
      return parseHsl
    }
    return () => null
  }

  function parseRgba(input: string): ColorTuple4 | null {
    const isRgba = input.startsWith('rgba(')
    const start = isRgba ? 5 : 4
    const end = input.length - 1
    const valueStr = input.slice(start, end)
    const rgba = valueStr.split(/\s*,\s*/).map(str => parseFloat(str)) as ColorTuple3 | ColorTuple4
    if (isRgba && rgba.length !== 4) {
      return null
    }
    if (!isRgba && rgba.length !== 3) {
      return null
    }
    const [r, g, b, a] = rgba
    if (r < 0 || r > 255) {
      return null
    }
    if (g < 0 || g > 255) {
      return null
    }
    if (b < 0 || b > 255) {
      return null
    }
    if (isRgba && (a! < 0 || a! > 1)) {
      return null
    }
    if (!isRgba) rgba.push(1)
    return rgba as ColorTuple4
  }

  function parseHex(input: string) {
    return hex2rgba(input)
  }

  function parseHsl(input: string): ColorTuple4 | null {
    const isHsla = input.startsWith('hsla(')
    const start = isHsla ? 5 : 4
    const end = input.length - 1
    const valueStr = input.slice(start, end)
    const hsla = valueStr.split(/\s*,\s*/).map(str => parseFloat(str))
    if (isHsla && hsla.length !== 4) return null
    if (!isHsla && hsla.length !== 3) return null
    const [h, s, l, a] = hsla
    if (h < 0 || h > 360) return null
    if (s < 0 || s > 100) return null
    if (l < 0 || l > 100) return null
    if (isHsla && (a < 0 || a > 1)) return null
    const hsv = hsl2hsv(h, s / 100, l / 100)
    const rgb = hsv2rgb(...hsv)
    return [...rgb, isHsla ? a : 1]
  }

  function parseHsv(input: string): ColorTuple4 | null {
    const valueStr = input.slice(4, input.length - 1)
    const hsv = valueStr.split(/\s*,\s*/).map(str => parseInt(str, 10))
    if (hsv.length !== 3) return null
    const [h, s, v] = hsv
    if (h < 0 || h > 360) return null
    if (s < 0 || s > 100) return null
    if (v < 0 || v > 100) return null
    const rgb = hsv2rgb(h, s / 100, v / 100)
    return [...rgb, 1]
  }
})()

export function rgbaFromHex(hexColor: string, opacity: number): string {
  return `rgba(${hex2rgba(hexColor)!.concat([opacity]).join(',')})`
}

export function useColorWithOpacity(color: string, opacity: number): string {
  const rgba = parse(color)
  if (rgba) {
    return `rgba(${rgba[0]},${rgba[0]},${rgba[0]},${opacity})`
  }
  console.warn('Invalid color: ', color)
  return ''
}
