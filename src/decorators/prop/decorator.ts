import { addDecoratorData } from '../decorators.js'
import { makeAccessor } from './makeAccessor.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export const prop: BlPropDecoratorMaker = <This extends Element, Value = any>(
  options: PropOptions = { defaults: null }
) => {
  const decorator: BlPropDecorator<This, Value> = (_, ctx) => {
    const propName = String(ctx.name)

    const { get, set, init } = makeAccessor(propName, options)

    addDecoratorData({
      type: 'prop',
      name: String(ctx.name),
      attrName: propName,
      upgrade: options.upgrade ?? true,
      observed: false,
    })

    return { get, set, init }
  }
  return decorator
}
