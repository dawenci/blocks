import { boolGetter, boolSetter, enumGetter, enumSetter } from './property.js'

export const activeGetter = boolGetter('active')
export const activeSetter = boolSetter('active')

export const disabledGetter = boolGetter('disabled')
export const disabledSetter = boolSetter('disabled')

export const sizeGetter = enumGetter('size', [null, 'small', 'large'])
export const sizeSetter = enumSetter('size', [null, 'small', 'large'])
