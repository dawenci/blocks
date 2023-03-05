// import { addDecoratorData } from './decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export function ref(selector: string, cache = true) {
  const decorator = <This extends Element, Value>(
    value: any,
    ctx: ClassGetterDecoratorContext<This, Value>
  ) => {
    if (cache) {
      let $cache: Element | null = null
      return function (this: This) {
        if (!$cache) {
          console.log('no cache')
          $cache = this.shadowRoot!.querySelector(selector)
        }
        return $cache
      }
    }
    return function (this: This) {
      return this.shadowRoot!.querySelector(selector)
    }
  }
  return decorator
}
