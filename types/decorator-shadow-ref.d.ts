type BlShadowRefDecorator<This extends Element, Value = any> = (
  value: any,
  ctx: ClassAccessorDecoratorContext<This, Value>
) => {
  init: (initialValue: Value) => Value
  get: (this: This) => any
  set: (this: This, value: Element | null) => void
}

interface BlBlShadowRefDecoratorMaker {
  <This extends Element, Value = any>(selector: string, cache?: boolean): BlShadowRefDecorator<This, Value>
}
