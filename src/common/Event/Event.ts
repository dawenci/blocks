export class Event<EventMap> {
  protected _data = Object.create(null)

  on<EventType extends keyof EventMap>(type: EventType, callback: EventMap[EventType]) {
    const hooks = this._data[type] ?? (this._data[type] = [])
    hooks.push(callback)
  }

  off<EventType extends keyof EventMap>(type: EventType, callback: EventMap[EventType]) {
    const hooks = this._data[type]
    if (!hooks) return
    const index = hooks.indexOf(callback)
    if (index !== -1) {
      hooks.splice(index, 1)
    }
  }

  offType<EventType extends keyof EventMap>(type: EventType) {
    delete this._data[type]
  }

  offAll() {
    this._data = Object.create(null)
  }

  triggerCtx<EventType extends keyof EventMap>(ctx: any, type: EventType) {
    const fns = this._data[type]
    if (!fns) return
    for (let i = 0; i < fns.length; ++i) {
      fns[i].call(ctx ?? this)
    }
  }

  trigger<EventType extends keyof EventMap>(type: EventType) {
    this.triggerCtx(undefined, type)
  }

  triggerWithArgsCtx<EventType extends keyof EventMap, Args extends any[] = []>(
    ctx: any,
    type: EventType,
    ...args: Args
  ) {
    const fns = this._data[type]
    if (!fns) return
    for (let i = 0; i < fns.length; ++i) {
      fns[i].apply(ctx ?? this, args)
    }
  }

  triggerWithArgs<EventType extends keyof EventMap, Args extends any[] = []>(type: EventType, ...args: Args) {
    this.triggerWithArgsCtx(undefined, type, ...args)
  }

  merge(other: Event<EventMap>) {
    Object.keys(other._data).forEach(key => {
      if (!this._data[key]) {
        this._data[key] = other._data[key]
      } else {
        this._data[key] = this._data[key].concat(other._data[key])
      }
    })
  }
}
