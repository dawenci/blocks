import { BlEvent } from './BlEvent.js'

export interface BlModel<T extends object = object> extends BlEvent {
  data: T
}

export class BlModel<T> extends BlEvent {
  _isDestroyed = false

  silent = false

  constructor(public data: T) {
    super()
  }

  has(key: any) {
    return key in this.data
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key]
  }

  set<K extends keyof T>(key: K, value: T[K]): boolean {
    const oldValue = this.data[key]
    if (oldValue === value) return false
    this.data[key] = value

    this.trigger(`update:${String(key)}`, oldValue, value)
    this.trigger('change')
    return true
  }

  batch(fn: (trigger: (name: string, payload: any) => void) => void) {
    this.silent = true
    fn.call(this, (name: string, payload: any) => {
      this.silent = false
      this.trigger(name, payload)
    })
  }

  reset(data: T) {
    this.data = data
    this.trigger('reset')
    this.trigger('change')
  }

  override trigger(name: string | string[], ...args: any[]): this {
    if (this.silent || this._isDestroyed) return this
    return super.trigger(name, ...args)
  }

  destroy() {
    this._isDestroyed = true
    this.off()
  }
}
