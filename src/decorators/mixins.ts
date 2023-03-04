export const mixins = <T extends CustomElementConstructor>(
  constructors: any[]
) => {
  const decorator = (
    target: T,
    { addInitializer }: ClassDecoratorContext<T>
  ) => {
    addInitializer(function (this: T) {
      constructors.forEach(baseCtor => {
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

      const rawObservedAttributes = (target as any).observedAttributes ?? []
      function getObservedAttributes() {
        return constructors.reduce(
          (acc, ctor) => acc.concat(ctor.observedAttributes ?? []),
          rawObservedAttributes
        )
      }

      Object.defineProperty(target, 'observedAttributes', {
        get: () => getObservedAttributes(),
        enumerable: true,
        configurable: true,
      })
    })
  }

  return decorator
}
