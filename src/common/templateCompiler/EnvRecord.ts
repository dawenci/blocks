import { ENV_PREFIX } from './constants.js'

export const enum EnvType {
  Root,
  For,
}

export class EnvRecord {
  static uid = 0

  type: EnvType
  rawName: string
  name: string

  constructor(type: EnvType, rawName: string) {
    this.type = type
    this.rawName = rawName
    this.name = `${ENV_PREFIX}${++EnvRecord.uid}`
  }

  static root() {
    return new EnvRecord(EnvType.Root, 'root')
  }

  static for(rawName: string) {
    return new EnvRecord(EnvType.For, rawName)
  }
}
