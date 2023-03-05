import { handleMembers } from './defineClass.js'

export const customElement = <T extends CustomElementConstructor>(
  name: string
) => {
  const decorator = (target: T, ctx: ClassDecoratorContext<T>) => {
    ctx.addInitializer(function (this: T) {
      handleMembers(target)

      // 注册自定义元素
      if (!customElements.get(name)) {
        customElements.define(name, target)
      }
    })
  }

  return decorator
}
