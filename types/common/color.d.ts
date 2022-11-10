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
 export function hsv2rgb(h: number, s: number, v: number): ColorTuple3

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
export function rgb2hsv(r: number, g: number, b: number): ColorTuple3

/**
 * 
 * HSV 转 HSL
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param {number} Hv 0 - 360
 * @param {number} Sv 0 - 1
 * @param {number} V 0 - 1
 */
 export function hsv2hsl(Hv: number, Sv: number, V: number): ColorTuple3

/**
 * 
 * HSL 转 HSV
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param {number} Hl 0 - 360
 * @param {number} Sl 0 - 1
 * @param {number} L 0 - 1
 */
export function hsl2hsv(Hl: number, Sl: number, L: number): ColorTuple3


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
export function hex2rgba(hex: string): [number, number, number, number] | null


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
export function rgba2hex(rgba: ColorTuple3 | ColorTuple4 | null): string


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
export const parse: (input: string) => ColorTuple4 | null

export function rgbaFromHex(hexColor: string, opacity: number): string

interface Window {
  rgb2hsv: typeof rgb2hsv
  hsv2rgb: typeof hsv2rgb
}
