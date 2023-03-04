import { BlEvent } from './BlEvent.js'

export interface BlModel<T extends object = object> extends BlEvent {
  data: T
}

export class BlModel<T> extends BlEvent {
  _isDestroyed = false

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key]
  }

  set<K extends keyof T>(key: K, value: T[K], preventEmit = false) {
    const oldValue = this.data[key]
    if (oldValue === value) return
    this.data[key] = value
    if (!preventEmit && !this._isDestroyed) {
      this.trigger(`update:${String(key)}`, oldValue, value)
    }
  }

  destroy() {
    this._isDestroyed = true
    this.off()
  }
}
