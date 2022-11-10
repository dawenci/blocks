/// <reference path="../types/common/propertyAccessor.d.ts" />

import { boolGetter, boolSetter, enumGetter, enumSetter } from './property.js'

export const activeGetter = boolGetter('active')
export const activeSetter = boolSetter('active')

export const checkedGetter = boolGetter('checked')
export const checkedSetter = boolSetter('checked')

export const clearableGetter = boolGetter('clearable')
export const clearableSetter = boolSetter('clearable')

export const closeableGetter = boolGetter('closeable')
export const closeableSetter = boolSetter('closeable')

export const darkGetter = boolGetter('dark')
export const darkSetter = boolSetter('dark')

export const disabledGetter = boolGetter('disabled')
export const disabledSetter = boolSetter('disabled')

export const multipleGetter = boolGetter('multiple')
export const multipleSetter = boolSetter('multiple')

export const openGetter = boolGetter('open')
export const openSetter = boolSetter('open')

export const selectedGetter = boolGetter('selected')
export const selectedSetter = boolSetter('selected')

export const sizeGetter = enumGetter('size', [null, 'small', 'large'])
export const sizeSetter = enumSetter('size', [null, 'small', 'large'])
