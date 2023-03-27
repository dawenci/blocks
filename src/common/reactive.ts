const id = <T>(a: T, b: T) => a === b

export interface IReactive<T = any> {
  content: T
  hasSub(sub: Sub<T>): boolean
  addSub(sub: Sub<T>): void
  removeSub(sub: Sub<T>): void
  clearSub(): void
}

interface SubFn<T = any> {
  (value: T, oldValue: T): void
}
interface SubObj<T = any> {
  update(value: T, oldValue: T): void
}

export type Sub<T> = SubFn<T> | SubObj<T>

type ExtractReactive<T> = T extends IReactive<infer IReactiveType> ? IReactiveType : never
type ExtractReactiveTuple<Tuple extends [...any[]]> = {
  [Index in keyof Tuple]: ExtractReactive<Tuple[Index]>
}

const isSubObj = <T>(sub: Sub<T>): sub is SubObj<T> => {
  return !!(sub as SubObj<T>).update
}

const callSub = <T>(sub: Sub<T>, state: T, prevState: T) => {
  if (isSubObj(sub)) {
    sub.update(state, prevState)
  } else {
    sub(state, prevState)
  }
}

class ReadWriteObservable<T> implements IReactive<T> {
  #state: T
  #equal: (a: T, b: T) => boolean
  #subs?: Set<Sub<T>>

  constructor(val: T, equal: (a: T, b: T) => boolean = id) {
    this.#state = val
    this.#equal = equal
  }

  get content() {
    return this.#state
  }

  set content(val: T) {
    if (this.#equal(this.content, val)) return
    const prevState = this.#state
    this.#state = val
    this.#notify(prevState)
  }

  hasSub(sub: Sub<T>): boolean {
    if (this.#subs) {
      return this.#subs.has(sub)
    }
    return false
  }

  addSub(sub: Sub<T>): void {
    if (this.#subs) {
      this.#subs.add(sub)
    } else {
      this.#subs = new Set([sub])
    }
  }

  removeSub(sub: Sub<T>): void {
    if (!this.#subs) return
    this.#subs.delete(sub)
  }

  clearSub(): void {
    this.#subs?.clear()
  }

  #notify(prevState: T) {
    if (this.#subs) {
      this.#subs.forEach(sub => {
        callSub(sub, this.content, prevState)
      })
    }
  }
}

class ComputedObservable<T, Deps extends IReactive[]> implements IReactive<T> {
  #source?: ReadWriteObservable<T>
  #equal: (a: T, b: T) => boolean
  #deps: Deps
  #update: (...args: ExtractReactiveTuple<Deps>) => T

  constructor(update: (...args: ExtractReactiveTuple<Deps>) => T, deps: Deps, equal: (a: T, b: T) => boolean) {
    this.#update = update
    this.#deps = deps
    this.#equal = equal
    this.#deps.forEach(dep => dep.addSub(this))
  }

  // 未消费前，无需创建 reactive 对象
  get content() {
    return this.#ensureReactive().content
  }

  hasSub(sub: Sub<T>): boolean {
    return this.#ensureReactive().hasSub(sub)
  }

  addSub(sub: Sub<T>): void {
    this.#ensureReactive().addSub(sub)
  }

  removeSub(sub: Sub<T>): void {
    this.#ensureReactive().removeSub(sub)
  }

  clearSub(): void {
    this.#ensureReactive().clearSub()
  }

  update(/* ignoreValueParam */) {
    if (this.#source) {
      this.#source.content = this.#compute()
    }
  }

  #ensureReactive(): ReadWriteObservable<T> {
    if (this.#source) return this.#source
    this.#source = new ReadWriteObservable<T>(this.#compute(), this.#equal)
    return this.#source
  }

  #compute() {
    const args = (this.#deps ? this.#deps.map(dep => dep.content) : []) as ExtractReactiveTuple<Deps>
    return this.#update(...args)
  }
}

export const reactive = <T>(val: T, equal?: (a: T, b: T) => boolean): IReactive<T> => {
  return new ReadWriteObservable<T>(val, equal)
}

export const computed = <T, Deps extends IReactive[]>(
  update: (...args: ExtractReactiveTuple<Deps>) => T,
  deps: Deps,
  equal: (a: T, b: T) => boolean = id
): IReactive<T> => {
  return new ComputedObservable<T, Deps>(update, deps, equal)
}

export const subscribe = <T>(reactive: IReactive<T>, sub: Sub<T>) => {
  reactive.addSub(sub)
  return () => reactive.removeSub(sub)
}

export const unsubscribe = <T>(reactive: IReactive<T>, sub?: Sub<T>) => {
  if (sub) {
    reactive.removeSub(sub)
  } else {
    reactive.clearSub()
  }
}
