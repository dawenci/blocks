import { appendObservedAttributes } from './appendObservedAttributes.js'

// 代理子元素的 accessor
export function handleAccessors<T extends CustomElementConstructor>(target: T, targetOrOptions: DefineClassOptions) {
  if (targetOrOptions.proxyAccessors) {
    targetOrOptions.proxyAccessors.forEach(({ klass, names }) => {
      appendObservedAttributes(target, names)

      names.forEach(name => {
        const accessorDesc = Object.getOwnPropertyDescriptor(klass.prototype, name)
        if (accessorDesc) {
          Object.defineProperty(target.prototype, name, accessorDesc)
        }
      })
    })
  }
}
