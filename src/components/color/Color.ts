import { round } from '../../common/utils.js'

export type ColorTuple3 = [number, number, number]
export type ColorTuple4 = [number, number, number, number]
export type ColorFormat =
  | 'rgb'
  | 'rgba'
  | 'hex'
  | '#rrggbb'
  | '#rrggbbaa'
  | '#rgb'
  | 'hsl'
  | 'hsla'
  | 'hsv'
  | 'hsva'

const toFloat = 1 / 255

const EPSILON = 0.000001

/**
 * @en Clamps a value between a minimum float and maximum float value.<br/>
 * @zh 返回最小浮点数和最大浮点数之间的一个数值。可以使用 clamp 函数将不断变化的数值限制在范围内。
 * @param val
 * @param min
 * @param max
 */
export function clamp(val: number, min: number, max: number) {
  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  return val < min ? min : val > max ? max : val
}

export interface Color {
  // 存储 rgba 四个 8 位数据的通道
  _val: number

  // 存储高分辨率的 alpha
  _alpha: number
}

/**
 * 通过 Red、Green、Blue 颜色通道表示颜色，并通过 Alpha 通道表示不透明度。<br/>
 * 每个通道都为取值范围 [0, 255] 的整数。<br/>
 */
export class Color {
  static TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0))
  static WHITE = Object.freeze(new Color(255, 255, 255, 255))
  static BLACK = Object.freeze(new Color(0, 0, 0, 255))
  static GRAY = Object.freeze(new Color(128, 128, 128, 255))
  static RED = Object.freeze(new Color(255, 0, 0, 255))
  static GREEN = Object.freeze(new Color(0, 255, 0, 255))
  static BLUE = Object.freeze(new Color(0, 0, 255, 255))
  static CYAN = Object.freeze(new Color(0, 255, 255, 255))
  static MAGENTA = Object.freeze(new Color(255, 0, 255, 255))
  static YELLOW = Object.freeze(new Color(255, 255, 0, 255))

  /**
   * 压缩 rgba 到一个整数，rgba 四个通道各使用 8 位存储
   * r,g,b,a 通道从低位到高位方向存放
   * @param {number} r red (0 - 255)
   * @param {number} g green (0 - 255)
   * @param {number} b blue (0 - 255)
   * @param {number} a alpha (0 - 255)
   */
  static toValue(r: number, g: number, b: number, a = 255): number {
    return ((a << 24) >>> 0) + (b << 16) + (g << 8) + r
  }

  /**
   * 将 0 - 1 的比例 alpha 转换成 0 - 255 的 8 位存储的 alpha
   */
  static to8BitAlpha(alpha: number) {
    return ~~clamp(round(alpha * 255), 0, 255)
  }

  /**
   * @param {number} r red(0 - 255)
   * @param {number} g green(0 - 255)
   * @param {number} b blue(0 - 255)
   * @param {number} alpha alpha(0 - 1)
   */
  static fromRgb(r: number, g: number, b: number, alpha = 1) {
    return new Color(r, g, b, alpha)
  }

  /**
   * @param {string} hexString 十六进制颜色表示
   */
  static fromHex(hexString: string) {
    hexString =
      hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString
    const r = parseInt(hexString.substr(0, 2), 16) || 0
    const g = parseInt(hexString.substr(2, 2), 16) || 0
    const b = parseInt(hexString.substr(4, 2), 16) || 0
    let alpha8bit = parseInt(hexString.substr(6, 2), 16)
    if (Number.isNaN(alpha8bit)) alpha8bit = 255
    return new Color(Color.toValue(r, g, b, alpha8bit))
  }

  /**
   * @param {number} h hue(0 - 360)
   * @param {number} s saturation(0 - 1)
   * @param {number} v value(0 - 1)
   * @param {number} alpha alpha(0 - 1)
   */
  static fromHsv(h: number, s: number, v: number, alpha = 1) {
    const [r, g, b] = hsv2rgb(h, s, v)
    return Color.fromRgb(round(r), round(g), round(b), alpha)
  }

  /**
   * @param {number} h hue(0 - 360)
   * @param {number} s saturation(0 - 1)
   * @param {number} l lightness(0 - 1)
   * @param {number} alpha alpha(0 - 1)
   */
  static fromHsl(h: number, s: number, l: number, alpha = 1) {
    const hsv = hsl2hsv(h, s, l)
    return Color.fromHsv(...hsv, alpha)
  }

  /**
   * 排除浮点数误差的颜色近似等价判断
   */
  static equals(a: Color, b: Color, epsilon = EPSILON) {
    return (
      Math.abs(a.b - b.b) <=
        epsilon * Math.max(1.0, Math.abs(a.b), Math.abs(b.b)) &&
      Math.abs(a.g - b.g) <=
        epsilon * Math.max(1.0, Math.abs(a.g), Math.abs(b.g)) &&
      Math.abs(a.r - b.r) <=
        epsilon * Math.max(1.0, Math.abs(a.r), Math.abs(b.r)) &&
      Math.abs(a.a - b.a) <=
        epsilon * Math.max(1.0, Math.abs(a.a), Math.abs(b.a))
    )
  }

  /**
   * 将当前颜色转换为 rgba 格式。
   * alpha 通道小数表示时，保留两位小数
   * @example
   * ```ts
   * let color = Color.BLACK;
   * Color.format(color, 'rgba');    // 'rgba(0,0,0,1.00)'
   * Color.format(color, 'rgb');    // 'rgba(0,0,0)'
   * Color.format(color, 'hex');    // '#000000'
   * Color.format(color, '#rrggbb');    // '#000000'
   * Color.format(color, '#rrggbbaa');    // '#000000FF'
   * Color.format(color, '#rgb');    // '#000'
   * Color.format(color, 'hsl');    // 'hsl()'
   * Color.format(color, 'hsla');    // 'hsla()'
   * Color.format(color, 'hsva');    // 'hsva()'
   * Color.format(color, 'hsva');    // 'hsva()'
   * ```
   */
  static format(color: Color, fmt: ColorFormat = 'rgba') {
    switch (fmt) {
      case 'rgba':
        return `rgba(${color.toRgb().join(',')},${round(color.alpha, 2)})`
      case 'rgb':
        return `rgb(${color.toRgb().join(',')})`
      case 'hex':
        fmt = color.a === 255 ? '#rrggbb' : '#rrggbbaa'
      case '#rrggbb':
      case '#rrggbbaa':
      case '#rgb': {
        const [r, g, b] = [color.r, color.g, color.b]
        const prefix = '0'
        // #rrggbb
        const hex = [
          (r < 16 ? prefix : '') + r.toString(16),
          (g < 16 ? prefix : '') + g.toString(16),
          (b < 16 ? prefix : '') + b.toString(16),
        ]
        if (fmt === '#rgb') {
          hex[0] = hex[0][0]
          hex[1] = hex[1][0]
          hex[2] = hex[2][0]
        } else if (fmt === '#rrggbbaa') {
          hex.push((color.a < 16 ? prefix : '') + color.a.toString(16))
        }
        return '#' + hex.join('')
      }
      case 'hsl': {
        const [h, s, l] = color.toHsl()
        return `hsl(${round(h)},${round(s * 100)}%,${round(l * 100)}%)`
      }
      case 'hsla': {
        const [h, s, l, a] = color.toHsla()
        return `hsl(${round(h)},${round(s * 100)}%,${round(l * 100)}%,${round(
          a,
          2
        )})`
      }
      case 'hsv': {
        const [h, s, v] = color.toHsv()
        return `hsv(${round(h)},${round(s * 100)}%,${round(v * 100)}%)`
      }
      case 'hsva': {
        const [h, s, v, a] = color.toHsva()
        return `hsva(${round(h)},${round(s * 100)}%,${round(v * 100)}%,${round(
          a,
          2
        )})`
      }
      default:
        return `rgba(${color.toRgb().join(',')},${round(color.alpha, 2)})`
    }
  }

  get value() {
    return this._val
  }

  set value(value: number) {
    this._val = value
    this._alpha = ((value & 0xff000000) >>> 24) * toFloat
  }

  /**
   * 获取或设置当前颜色的 Blue 通道。
   */
  get r() {
    return this._val & 0x000000ff
  }

  set r(red) {
    red = ~~clamp(red, 0, 255)
    this._val = ((this._val & 0xffffff00) | red) >>> 0
  }

  /**
   * 获取或设置当前颜色的 Green 通道。
   */
  get g() {
    return (this._val & 0x0000ff00) >> 8
  }

  set g(green) {
    green = ~~clamp(green, 0, 255)
    this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0
  }

  /**
   * 获取或设置当前颜色的 Red 通道。
   */
  get b() {
    return (this._val & 0x00ff0000) >> 16
  }

  set b(blue) {
    blue = ~~clamp(blue, 0, 255)
    this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0
  }

  /**
   * 获取或设置当前颜色的透明度通道。
   */
  get a() {
    return (this._val & 0xff000000) >>> 24
  }

  /**
   * @param {number} alpha 0 - 255
   */
  set a(alpha: number) {
    alpha = ~~clamp(alpha, 0, 255)
    this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0
    this._alpha = alpha * toFloat
  }

  get alpha() {
    return this._alpha
  }

  /**
   * @param {number} alpha 0 - 1
   */
  set alpha(alpha: number) {
    this._alpha = alpha
    this._val =
      ((this._val & 0x00ffffff) | (Color.to8BitAlpha(alpha) << 24)) >>> 0
  }

  /**
   * 使用整数值进行构造
   */
  constructor(val: number)

  /**
   * 用十六进制颜色字符串中构造颜色。
   * @param hexString Hexadecimal color string.
   */
  constructor(hexString: string)

  /**
   * 构造具有指定通道的颜色。
   * @param r red component of the color
   * @param g green component of the color
   * @param b blue component of the color
   * @param a alpha component of the color, default value is 255.
   */
  constructor(r: number, g: number, b: number, alpha?: number)

  constructor(r: number | string, g?: number, b?: number, alpha?: number) {
    if (typeof r === 'string') {
      return Color.fromHex(r)
    } else if (
      typeof r === 'number' &&
      typeof g === 'number' &&
      typeof b === 'number'
    ) {
      alpha = alpha ?? 1
      this._val = Color.toValue(r, g, b, Color.to8BitAlpha(alpha))
      this._alpha = alpha
    } else {
      this._val = r
      this._alpha = this.a * toFloat
    }
  }

  /**
   * 判断当前颜色是否与指定颜色相等。
   * @param other Specified color
   * @returns Returns `true` when all channels of both colours are equal; otherwise returns `false`.
   */
  equals(other: Color) {
    return this === other || this._val === other._val
  }

  toString(fmt: ColorFormat = 'rgba') {
    return Color.format(this, fmt)
  }

  toRgb(): ColorTuple3 {
    return [this.r, this.g, this.b]
  }

  toRgba(): ColorTuple4 {
    return [this.r, this.g, this.b, this.alpha]
  }

  toHsv(): ColorTuple3 {
    return rgb2hsv(this.r, this.g, this.b)
  }

  toHsva(): ColorTuple4 {
    return this.toHsv().concat(this.alpha) as unknown as ColorTuple4
  }

  toHsl(): ColorTuple3 {
    return hsv2hsl(...this.toHsv())
  }

  toHsla(): ColorTuple4 {
    return this.toHsl().concat(this.alpha) as unknown as ColorTuple4
  }
}

/**
 *
 * HSV 转 RGB
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param {number} h hue(0 - 360)
 * @param {number} s saturation(0 - 1)
 * @param {number} v value(0 - 1)
 */
function hsv2rgb(h: number, s: number, v: number): ColorTuple3 {
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
function rgb2hsv(r: number, g: number, b: number): ColorTuple3 {
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
function hsv2hsl(Hv: number, Sv: number, V: number): ColorTuple3 {
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
function hsl2hsv(Hl: number, Sl: number, L: number): ColorTuple3 {
  const Hv = Hl
  const V = L + Sl * Math.min(L, 1 - L)
  const Sv = V === 0 ? 0 : 2 * (1 - L / V)
  return [Hv, Sv, V]
}
