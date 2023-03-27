import { clearDecoratorData, getDecoratorData } from './decorators.js'

type ClassOptions = {
  mixins?: any[]
  styles?: string[]
  customElement?: string
  attachShadow?: boolean | ShadowRootInit
}

function isOptions(targetOrOptions: unknown): targetOrOptions is ClassOptions {
  return typeof targetOrOptions === 'object'
}

/**
 * 传入 mixin 的类，实现多继承
 */
export function defineClass<T extends CustomElementConstructor>(
  options: ClassOptions
): (target: T, ctx: ClassDecoratorContext<T>) => void

/**
 * 类装饰器
 */
export function defineClass<T extends CustomElementConstructor>(target: T, ctx: ClassDecoratorContext<T>): void

export function defineClass<T extends CustomElementConstructor>(
  targetOrOptions: T | any[],
  ctx?: ClassDecoratorContext<T>
) {
  if (isOptions(targetOrOptions)) {
    return (target: T, ctx: ClassDecoratorContext<T>) => {
      ctx.addInitializer(function (this: T) {
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

        if (targetOrOptions.styles) {
          const $style: HTMLStyleElement = document.createElement('style')
          $style.textContent = targetOrOptions.styles.join('\n')
          appendComponentStyles(target, $style)
        }

        handleMembers(target)

        if (targetOrOptions.attachShadow) {
          const shadowRootInit: ShadowRootInit =
            typeof targetOrOptions.attachShadow !== 'object'
              ? { mode: 'open' }
              : (targetOrOptions.attachShadow as ShadowRootInit)
          Object.defineProperty(target, '_shadowRootInit', {
            get: () => shadowRootInit,
            enumerable: true,
            configurable: true,
          })
        }

        if (targetOrOptions.customElement) {
          // 注册自定义元素
          if (!customElements.get(targetOrOptions.customElement)) {
            customElements.define(targetOrOptions.customElement, target)
          }
        }
      })
    }
  } else {
    ctx!.addInitializer(function (this: T) {
      handleMembers(targetOrOptions as T)
    })
  }
}

export function handleMembers<T extends CustomElementConstructor>(target: T) {
  // 消费当前 class 定义过程，各个 member 装饰器注册的信息后
  const data = getDecoratorData()
  // 1. attribute 处理
  // 从 @attr 装饰器添加的信息中，提取本轮注册的所有 attr，
  // 过滤出 `observed` 属性不为 `false` 的记录，添加到 `observedAttributes` 中
  appendObservedAttributes(
    target,
    data.filter(record => record.type === 'attr' && record.observed !== false).map(record => record.attrName!)
  )

  // 2. property 处理
  // 从成员装饰器添加的信息中，提取本轮注册的所有装饰器信息记录，
  // 过滤出 `upgrade` 属性不为 `false` 的记录，添加到 `upgradeProperties` 中
  appendUpgradeProperties(
    target,
    data.filter(record => record.upgrade).map(record => record.name!)
  )

  // 消费完所有 member 装饰器注册的信息后，清空记录，以便下一个组件类定义使用
  clearDecoratorData()
}

// 检测继承链上各个 class 是否有观察属性
function hasObservedAttributes<T>(target: T): target is T & { get observedAttributes(): string[] } {
  return !!(target as any).observedAttributes
}
export function appendObservedAttributes<T extends CustomElementConstructor>(target: T, observedAttrs: string[]) {
  if (observedAttrs.length) {
    let newGetter: any
    if (hasObservedAttributes(target)) {
      const mergedAttrs = [...new Set((target.observedAttributes ?? []).concat(observedAttrs))]
      newGetter = () => mergedAttrs
    } else {
      newGetter = () => observedAttrs
    }
    Object.defineProperty(target, 'observedAttributes', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}

// 检测继承链上各个 class 是否有需要升级的属性
function hasUpgradeProperties<T>(target: T): target is T & { get upgradeProperties(): string[] } {
  return (target as any).upgradeProperties
}
export function appendUpgradeProperties<T extends CustomElementConstructor>(target: T, upgradeProps: string[]) {
  if (upgradeProps.length) {
    let newGetter: any
    if (hasUpgradeProperties(target)) {
      const mergedProps = [...new Set((target.upgradeProperties ?? []).concat(upgradeProps))]
      newGetter = () => mergedProps
    } else {
      newGetter = () => upgradeProps
    }
    Object.defineProperty(target, 'upgradeProperties', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}

// 继承链上是否有 _$componentStyle
function hasStyles<T>(target: T): target is T & { get _$componentStyle(): DocumentFragment } {
  return !!(target as any)._$componentStyle
}
export function appendComponentStyles<T extends CustomElementConstructor>(
  target: T,
  $fragment: DocumentFragment | HTMLStyleElement
) {
  if ($fragment) {
    const $styleFragment = hasStyles(target)
      ? target._$componentStyle.cloneNode(true)
      : document.createDocumentFragment()

    $styleFragment.appendChild($fragment.cloneNode(true))

    Object.defineProperty(target, '_$componentStyle', {
      get: () => $styleFragment,
      enumerable: true,
      configurable: true,
    })
  }
}
