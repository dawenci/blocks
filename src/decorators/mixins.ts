import {
  appendObservedAttributes,
  appendUpgradeProperties,
} from './defineClass.js'
import { appendComponentStyles } from './style.js'

export const mixins = <T extends CustomElementConstructor>(
  constructors: any[]
) => {
  const decorator = (
    target: T,
    { addInitializer }: ClassDecoratorContext<T>
  ) => {
    addInitializer(function (this: T) {
      constructors.forEach(baseCtor => {
        // 原型混入
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
          if (name === 'constructor' && target.prototype.constructor) {
            return
          }
          Object.defineProperty(
            target.prototype,
            name,
            Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
              Object.create(null)
          )
        })
      })

      // 静态 getter observedAttributes 合并
      appendObservedAttributes(
        target,
        constructors.reduce(
          (acc, ctor) => acc.concat(ctor.observedAttributes ?? []),
          []
        )
      )

      // 静态 getter upgradeProperties 合并
      appendUpgradeProperties(
        target,
        constructors.reduce(
          (acc, ctor) => acc.concat(ctor.upgradeProperties ?? []),
          []
        )
      )

      // 合并 _$componentStyle
      appendComponentStyles(
        target,
        constructors.reduce((acc, ctor) => {
          if (!acc) return ctor._$componentStyle
          if (ctor._$componentStyle) {
            if (!acc) {
              acc = document.createDocumentFragment()
            }
            acc.appendChild(ctor._$componentStyle)
          }
          return acc
        }, null)
      )
    })
  }

  return decorator
}
