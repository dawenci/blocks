type DefineClassOptions = {
  mixins?: any[]
  styles?: string[]
  proxyAccessors?: { klass: any; names: readonly string[] }[]
  customElement?: string
  attachShadow?: boolean | ShadowRootInit
}
