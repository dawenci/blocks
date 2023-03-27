type IdType = `${number}`
const uniqueId = (function () {
  let id = 0
  return function uniqueId(): IdType {
    return `${id++}`
  }
})()

const isEmpty = (() => {
  const hasOwn = Object.prototype.hasOwnProperty
  return function isEmpty(obj: object) {
    for (const p in obj) {
      if (hasOwn.call(obj, p)) return false
    }
    return true
  }
})()

const isPlainObject = (() => {
  const toString = Object.prototype.toString
  return function (obj: any): boolean {
    return toString.call(obj) === '[object Object]'
  }
})()

function isBlEvent(obj: unknown): obj is BlEvent {
  return typeof (obj as BlEvent)?.on === 'function'
}

/**
 * 映射 `{ event: callback }` 为 ` { event: onceWrapper } ` 的包裹形式
 * `offer` 用来在 `onceWrapper` 调用后解包
 */
function onceMap(
  output: Record<string, BlHandler>,
  type: string,
  callback: BlHandler,
  offer: (type: string, cb: BlHandler) => void
) {
  if (typeof callback !== 'function') return output

  const _once = (output[type] = function (this: any, ...args: any[]) {
    offer(type, _once)
    callback.apply(this, args)
  })

  ;(_once as BlHandler)._callback = callback

  return output
}

function makeOnceWrapper(
  typeOrMap: string | string[] | Record<string, BlHandler>,
  callback: any,
  offer: any
): Record<string, BlHandler> {
  const output = Object.create(null)
  if (typeof typeOrMap === 'string') {
    onceMap(output, typeOrMap, callback, offer)
  } else if (Array.isArray(typeOrMap)) {
    typeOrMap.forEach(name => onceMap(output, name, callback, offer))
  } else if (isPlainObject(typeOrMap)) {
    const obj = typeOrMap
    Object.keys(obj).forEach(name => onceMap(output, name, obj[name], offer))
  }
  return output
}

// 向 `events` 对象添加事件回调
function addBinding(events: BlBindingsMap, type: string, callback: BlHandler): void {
  const handlers = events[type] ?? (events[type] = [])

  // 如果当前是 listenTo，listening 对象的引用计数自增
  _currentListening?.refInc()

  handlers.push({ callback, listening: _currentListening })
}

function normalizeAndAddEvent(
  events: BlBindingsMap,
  typeOrKv: string | string[] | Record<string, BlHandler>,
  callback?: any
): void {
  if (typeof typeOrKv === 'string') {
    if (!callback) return
    addBinding(events, typeOrKv, callback)
  } else if (Array.isArray(typeOrKv)) {
    if (!callback) return
    typeOrKv.forEach(name => addBinding(events, name, callback))
  } else if (isPlainObject(typeOrKv)) {
    const obj = typeOrKv
    Object.keys(obj).forEach(name => {
      const callback = obj[name] as BlHandler
      if (!callback) return
      addBinding(events, name, callback)
    })
  }
}

// 从 `events` 对象中移除事件回调
function removeBinding(events: BlBindingsMap, type?: string | undefined, callback?: BlHandler): void {
  // 如果没有指定 type（undefined、null），则移除的过滤范围为所有事件 type
  const names: string[] = typeof type === 'string' ? [type] : Object.keys(events)
  for (let i = 0; i < names.length; i++) {
    type = names[i]
    const handlers = events[type]
    if (!handlers) return

    const remaining = []
    for (let j = 0; j < handlers.length; j++) {
      const handler = handlers[j]
      // 指定了 callback 时，只能解绑 callback 也匹配的条目
      if (callback && callback !== handler.callback && callback !== handler.callback._callback) {
        remaining.push(handler)
      }

      // 否则同名的全部解绑
      else {
        handler.listening?.refDec()
      }
    }

    // 如果还有事件，则替换
    if (remaining.length) {
      events[type] = remaining
    }
    // 否则做清理
    else {
      delete events[type]
    }
  }
}

function normalizeAndRemoveEvent(events: BlBindingsMap, typeOrMapOrCb?: any, callback?: BlHandler): void {
  if (typeOrMapOrCb == null || typeof typeOrMapOrCb === 'string') {
    removeBinding(events, typeOrMapOrCb, callback)
  }

  if (typeof typeOrMapOrCb === 'function') {
    removeBinding(events, void 0, typeOrMapOrCb)
  } else if (Array.isArray(typeOrMapOrCb)) {
    typeOrMapOrCb.forEach(name => {
      if (name) {
        removeBinding(events, name, callback)
      }
    })
  } else if (isPlainObject(typeOrMapOrCb)) {
    const obj = typeOrMapOrCb
    Object.keys(obj).forEach(name => {
      const callback = obj[name] as BlHandler
      removeBinding(events, name, callback)
    })
  }
}

// 触发符合要求的事件回调
// !注意，当 trigger 的 type 为 'all'，并且确实有监听 'all' 事件，
// !则会触发 2 次，第一次 type 恰好等于 'all' 触发的，另一次是所有事件 type 触发时，联动触发的 'all'
function triggerEvents(events: BlBindingsMap, type: string | string[], args: any) {
  const types = Array.isArray(type) ? type : [type]
  types.forEach(type => {
    const handlers = events[type]

    let allEvents = events.all

    if (handlers && allEvents) {
      allEvents = allEvents.slice()
    }

    if (handlers) {
      trigger(handlers, args)
    }

    if (allEvents) {
      trigger(allEvents, [type].concat(args))
    }
  })
}

// 针对 3 个以内的参数进行优化
function trigger(handlerRecords: any[], args: any[]) {
  const count = handlerRecords.length
  const arg1 = args[0]
  const arg2 = args[1]
  const arg3 = args[2]
  let i = -1
  switch (args.length) {
    case 0:
      while (++i < count) handlerRecords[i].callback()
      return
    case 1:
      while (++i < count) handlerRecords[i].callback(arg1)
      return
    case 2:
      while (++i < count) handlerRecords[i].callback(arg1, arg2)
      return
    case 3:
      while (++i < count) handlerRecords[i].callback(arg1, arg2, arg3)
      return
    default:
      while (++i < count) handlerRecords[i].callback(...args)
      return
  }
}

const EVENTS_FIELD = '_bl_events_'
const ID_FIELD = '_bl_event_id_'
const LISTENER_FIELD = '_bl_listeners_'
const LISTENING_FIELD = '_bl_listening_'
// const EVENTS_FIELD = Symbol('_bl_events_')
// const ID_FIELD = Symbol('_bl_event_id_')
// const LISTENER_FIELD = Symbol('_bl_listeners_')
// const LISTENING_FIELD = Symbol('_bl_listening_')

// 私有全局变量
// 调用 .listenTo 的时候，此处临时引用对应的 Listening 对象，
// 方便 listenTo 内部调用对方 .on 方法的时候，可以读取到上下文
let _currentListening: any

export type BlBindingsMap = Record<string, Array<{ callback: BlHandler; listening: Listening }>>
export type ListenerMap = Record<IdType, Listening>
export type BlHandler = {
  (...args: any[]): any
  _callback?: BlHandler
}

/**
 * Listening 类，用来维护两个 BlEvent 对象的监听（listenTo）关系，
 * 使用引用计数，每次 listenTo +1，每次 off -1，引用计数为 0 时销毁。
 */
export class Listening {
  refCount = 0
  listenerId: IdType
  listenToId: IdType

  constructor(public listener: BlEvent, public target: BlEvent) {
    this.listener = listener
    this.target = target
    this.listenerId = listener[ID_FIELD]!
    this.listenToId = target[ID_FIELD]!
  }

  refInc() {
    ++this.refCount
  }

  refDec() {
    if (--this.refCount === 0) this.cleanup()
  }

  cleanup() {
    delete this.listener[LISTENING_FIELD]![this.listenToId]
    delete this.target[LISTENER_FIELD]![this.listenerId]
  }
}

export class BlEvent {
  // 记录实践绑定
  // 只有需要的时候才生成
  [EVENTS_FIELD]?: BlBindingsMap;

  // id，监听时，用来辨识对象，
  // 只有需要的时候才生成
  [ID_FIELD]?: IdType;

  // 记录监听本事件对象的其他对象
  // 只有需要的时候才生成
  [LISTENER_FIELD]?: ListenerMap;

  // 记录监听中的其他事件对象的引用
  // 只有需要的时候才生成
  [LISTENING_FIELD]?: ListenerMap

  /** 监听事件（绑定单个 type 到 callback） */
  on(type: string, callback: BlHandler): this
  /** 监听事件（绑定一组 type 到同一个 callback） */
  on(types: string[], callback: BlHandler): this
  /** 监听事件（以对象 key 为 type，value 为 callback，绑定 type 到 callback） */
  on(keyValue: Record<string, BlHandler>): this
  // 实现
  on(typeOrKv: string | string[] | Record<string, BlHandler>, callback?: any): this {
    const events = (this[EVENTS_FIELD] = this[EVENTS_FIELD] ?? Object.create(null))

    normalizeAndAddEvent(events, typeOrKv, callback)

    // 当前是另外一个 BlEvent(即 listener) 正在 listenTo this
    // 将该 listener 添加到订阅者列表中
    if (_currentListening) {
      const listeners = this[LISTENER_FIELD] || (this[LISTENER_FIELD] = Object.create(null))
      listeners[_currentListening.id] = _currentListening
    }

    return this
  }

  /** 监听一次事件（绑定单个 type 到 callback） */
  once(type: string, callback: BlHandler): this
  /** 监听一次事件（绑定一组 type 到同一个 callback） */
  once(types: string[], callback: BlHandler): this
  /** 监听一次事件（以对象 key 为 type，value 为 callback，绑定 type 到 callback） */
  once(keyValue: Record<string, BlHandler>): this
  // 实现
  once(typeOrKv: string | string[] | Record<string, BlHandler>, callback?: any): this {
    return this.on(makeOnceWrapper(typeOrKv, callback, this.off.bind(this)))
  }

  /** 移除所有事件绑定 */
  off(): this
  /** 移除指定 callback 的所有事件绑定 */
  off(callback: BlHandler): this
  /** 移除指定 type 的所有事件绑定 */
  off(type: string): this
  /** 移除指定 type、callback 的事件绑定 */
  off(type: string, callback: BlHandler): this
  /** 移除指定的一组 type 的所有事件绑定 */
  off(types: string[]): this
  /** 移除指定的一组 type 的，并且指定 callback 的所有事件绑定 */
  off(types: string[], callback: BlHandler): this
  /** 移除事件（以对象 key 为 type，value 为 callback，移除对应 type、callback 的所有事件） */
  off(keyValue: Record<string, BlHandler>): this
  // 实现
  off(typeOrKvOrCb?: any, callback?: BlHandler) {
    const events = this[EVENTS_FIELD]
    if (!events) return this
    normalizeAndRemoveEvent(events, typeOrKvOrCb, callback)
    return this
  }

  // 激发事件
  trigger(type: string | string[], ...payloads: any[]) {
    const events = this[EVENTS_FIELD]
    if (!events) return this
    triggerEvents(events, type, payloads)
    return this
  }

  /** 监听事件（绑定单个 type 到 callback），`on` 的 IOC 版本，便于后续解绑 */
  listenTo(other: BlEvent, type: string, callback: BlHandler): this
  /** 监听事件（绑定一组 type 到同一个 callback），`on` 的 IOC 版本，便于后续解绑 */
  listenTo(other: BlEvent, types: string[], callback: BlHandler): this
  /** 监听事件（以对象 key 为 type，value 为 callback，绑定 type 到 callback），`on` 的 IOC 版本，便于后续解绑 */
  listenTo(other: BlEvent, keyValue: Record<string, BlHandler>): this
  // 实现
  listenTo(other: BlEvent, typeOrKv: string | string[] | Record<string, BlHandler>, callback?: BlHandler): this {
    if (!isBlEvent(other)) return this

    // 监听的目标的 ID
    const id = other[ID_FIELD] || (other[ID_FIELD] = uniqueId())

    // 保存监听信息的对象，如果还不存在，则创建
    const listeningMap = this[LISTENING_FIELD] || (this[LISTENING_FIELD] = Object.create(null))

    // 之前已经监听过 other，则取出 Listening 对象使用，否则就是首次监听，需要做一些初始化
    _currentListening = listeningMap[id]
    if (!_currentListening) {
      // 未监听过任何其他对象的话，初始化自己的 ID
      if (!this[ID_FIELD]) this[ID_FIELD] = uniqueId()
      _currentListening = listeningMap[id] = new Listening(this, other)
    }

    other.on(typeOrKv as any, callback as any)
    _currentListening = void 0

    return this
  }

  /** 监一次听事件（绑定单个 type 到 callback），`once` 的 IOC 版本，便于后续解绑 */
  listenToOnce(other: BlEvent, type: string, callback: BlHandler): this
  /** 监听一次事件（绑定一组 type 到同一个 callback），`once` 的 IOC 版本，便于后续解绑 */
  listenToOnce(other: BlEvent, types: string[], callback: BlHandler): this
  /** 监听一次事件（以对象 key 为 type，value 为 callback，绑定 type 到 callback），`once` 的 IOC 版本，便于后续解绑 */
  listenToOnce(other: BlEvent, keyValue: Record<string, BlHandler>): this
  // 实现
  listenToOnce(other: BlEvent, typeOrKv: string | string[] | Record<string, BlHandler>, callback?: BlHandler): this {
    const events = makeOnceWrapper(typeOrKv, callback, this.stopListening.bind(this, other))
    return this.listenTo(other, events)
  }

  /** 停止监听所有事件 */
  stopListening(): this
  /** 停止对的指定的 callback 的所有事件的监听 */
  stopListening(callback: BlHandler): this
  /** 停止对的指定的 type 的所有事件的监听 */
  stopListening(type: string): this
  /** 停止对的指定的一组 type 的所有事件的监听 */
  stopListening(types: string[]): this
  /** 停止对 other 的所有事件的监听 */
  stopListening(other: BlEvent): this
  /** 停止对 other 的指定的 callback 的所有事件的监听 */
  stopListening(other: BlEvent, callback: BlHandler): this
  /** 停止对 other 的指定的 type、callback 的事件的监听（通过对象指定） */
  stopListening(other: BlEvent, events: Record<string, BlHandler>): this
  /** 停止对 other 的指定的 type 的事件的监听（通过 type 指定） */
  stopListening(other: BlEvent, type: string): this
  /** 停止对 other 的指定的 type、callback 的事件的监听（通过 type 和 callback 指定） */
  stopListening(other: BlEvent, type: string, callback: BlHandler): this
  /** 停止对 other 的指定的一组 type 的事件的监听（通过 type 数组指定） */
  stopListening(other: BlEvent, types: string[]): this
  /** 停止对 other 的指定的一组 type 和指定 callback 的事件的监听（通过 type 数组和 callback 指定） */
  stopListening(other: BlEvent, types: string[], callback: BlHandler): this
  // 实现
  stopListening(other?: any, typeOrKvOrCb?: any, callback?: any): this {
    const listeningMap = this[LISTENING_FIELD]
    if (!listeningMap) return this

    const hasTarget = isBlEvent(other)
    if (!hasTarget) {
      callback = typeOrKvOrCb
      typeOrKvOrCb = other
    }

    const stop = (listening: Listening) => {
      if (typeOrKvOrCb && callback) {
        listening.target.off(typeOrKvOrCb /*type or types*/, callback)
      } else {
        listening.target.off(typeOrKvOrCb /*type or types or callback or key-value*/)
      }
    }

    // stop 单个目标
    if (hasTarget) {
      const id = other[ID_FIELD]
      const listening = id ? listeningMap[id] : null
      // listening 不存在则表示当前对象并没有监听 other
      if (listening) {
        stop(listening)
      }
    }
    // stop 所有的目标
    else {
      const ids = Object.keys(listeningMap) as IdType[]
      for (let i = 0; i < ids.length; i++) {
        const listening = listeningMap[ids[i]]
        stop(listening)
      }
    }

    if (isEmpty(listeningMap)) this[LISTENING_FIELD] = void 0

    return this
  }
}
