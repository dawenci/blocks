import { ENV_PREFIX } from './constants.js'

export const enum EnvType {
  Root,
  For,
}

export class EnvRecord {
  type: EnvType
  rawName: string
  name: string

  constructor(type: EnvType, name: string) {
    this.type = type
    this.rawName = name
    this.name = ENV_PREFIX + name
  }

  static root() {
    return new EnvRecord(EnvType.Root, 'root')
  }

  static for(name: string) {
    return new EnvRecord(EnvType.For, name)
  }
}
