import { handleMixins } from './handleMixins.js'
import { handleMembers } from './handleMembers.js'
import { handleAccessors } from './handleAccessors.js'
import { handleCustomElement } from './handleCustomElement.js'
import { handleShadowDom } from './handleShadowDom.js'
import { handleStyles } from './handleStyles.js'

export function defineClass<T extends CustomElementConstructor>(
  options: DefineClassOptions
): (target: T, ctx: ClassDecoratorContext<T>) => void

export function defineClass<T extends CustomElementConstructor>(target: T, ctx: ClassDecoratorContext<T>): void

/**
 * 类装饰器
 */
export function defineClass<T extends CustomElementConstructor>(
  targetOrOptions: T | any[],
  ctx?: ClassDecoratorContext<T>
) {
  if (isOptions(targetOrOptions)) {
    return (target: T, ctx: ClassDecoratorContext<T>) => {
      ctx.addInitializer(function (this: T) {
        handleMixins(target, targetOrOptions)

        handleAccessors(target, targetOrOptions)

        handleStyles(target, targetOrOptions)

        handleMembers(target)

        handleShadowDom(target, targetOrOptions)

        handleCustomElement(target, targetOrOptions)
      })
    }
  } else {
    ctx!.addInitializer(function (this: T) {
      handleMembers(targetOrOptions as T)
    })
  }
}

function isOptions(targetOrOptions: unknown): targetOrOptions is DefineClassOptions {
  return typeof targetOrOptions === 'object'
}
