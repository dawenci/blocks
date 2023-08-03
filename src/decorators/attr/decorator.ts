import { makeAccessor } from './makeAccessor.js'
import { kebabCase } from '../../common/utils.js'
import { addDecoratorData } from '../decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 * > 注意：boolean 类型的 defaults 设置是无效的，因为默认永远会是 false
 */
export const attr = (<This extends Element, Value = any>(
  attrType: AttrType = 'string',
  options: AttrOptions = { defaults: null }
) => {
  const decorator: BlAttrDecorator<This, Value> = (_, ctx) => {
    const attrName = kebabCase(String(ctx.name))

    const { get, set, init } = makeAccessor(attrType, attrName, options)

    addDecoratorData({
      type: 'attr',
      name: String(ctx.name),
      attrType,
      attrName,
      upgrade: options.upgrade ?? true,
      observed: options.observed,
    })

    return { get, set, init }
  }

  return decorator
}) as BlAttrDecoratorMaker

attr.bool = attr('boolean')
attr.int = attr('int')
attr.num = attr('number')
attr.str = attr('string')
attr.enum = enumValues => attr('enum', { enumValues })
attr.intRange = (min: number, max: number) => attr('intRange', { min, max })
