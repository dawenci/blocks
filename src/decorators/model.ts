import { kebabCase } from '../common/utils.js'

export function model() {
  const decorator = <This extends Element, Value>(
    accessor: {
      get: () => Value
      set: (value: Value) => void
    },
    ctx: ClassAccessorDecoratorContext<This, Value>
  ) => {
    console.log('model init', accessor, kebabCase(String(ctx.name)))
  }
  return decorator
}
