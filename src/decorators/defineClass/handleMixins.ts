import { appendComponentStyles } from './appendComponentStyles.js'
import { appendObservedAttributes } from './appendObservedAttributes.js'
import { appendUpgradeProperties } from './appendUpgradeProperties.js'

export function handleMixins<T extends CustomElementConstructor>(target: T, targetOrOptions: DefineClassOptions) {
  if (targetOrOptions.mixins) {
    // 混入多个基类的原型
    targetOrOptions.mixins.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        // 不拷贝 mixin 中的构造器
        if (name === 'constructor' && target.prototype.constructor) {
          return
        }

        const desc = Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)

        // 特殊处理 `setupMixin`，多个 mixin 中的 setupMixin，不能覆盖，而要顺序调用（在构造器中自动调用）
        if (name === 'setupMixin' && target.prototype.setupMixin) {
          const fn1 = target.prototype.setupMixin
          const fn2 = desc.value
          const newFn = function (this: any) {
            fn1.call(this)
            fn2.call(this)
          }
          desc.value = newFn
        }

        Object.defineProperty(target.prototype, name, desc)
      })
    })

    // 基类的静态 getter observedAttributes 合并
    appendObservedAttributes(
      target,
      targetOrOptions.mixins.reduce((acc, ctor) => acc.concat(ctor.observedAttributes ?? []), [])
    )

    // 基类的静态 getter upgradeProperties 合并
    appendUpgradeProperties(
      target,
      targetOrOptions.mixins.reduce((acc, ctor) => acc.concat(ctor.upgradeProperties ?? []), [])
    )

    // 基类的静态 _$componentStyle 合并
    appendComponentStyles(
      target,
      targetOrOptions.mixins.reduce((acc, ctor) => {
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
  }
}
