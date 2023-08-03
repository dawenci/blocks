type DecoratorRecord = {
  type: 'attr' | 'prop' | 'shadowRef'
  name: string
  attrType?: string
  attrName?: string
  upgrade?: boolean
  observed?: boolean
}
