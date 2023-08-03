import { attr } from './decorator.js'

export { attr }
export { makeAccessor as makeAttrAccessor } from './makeAccessor.js'

// 常用 attr
export const attrs: Record<string, BlAttrDecorator<any, any>> = {
  size: attr('enum', { enumValues: ['small', 'large'] }) as BlAttrDecorator<Element, MaybeOneOf<['small', 'large']>>,
}
