import { BlComponent, BlComponentEventMap } from '../components/component/Component.js'

export function dispatchEvent<T = any>(element: Element, eventName: string, options: CustomEventInit = {}): boolean {
  options = Object.assign(
    {
      // 是否冒泡
      bubbles: true,
      // 是否可以取消
      cancelable: true,
      // 事件是否可以越过 shadowDOM 边界往外传播
      // 注：该行为生效的前提是 `bubbles` 属性值为 true
      composed: true,
    },
    options
  )
  const event = new CustomEvent<T>(eventName, options)
  return element.dispatchEvent(event)
}

export function onEvent<M, K extends keyof M, E extends Element = Element>(
  element: E,
  type: K,
  listener: (this: E, ev: M[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onEvent<K extends keyof BlComponentEventMap, E extends BlComponent = BlComponent>(
  element: E,
  type: K,
  listener: (this: E, ev: BlComponentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onEvent<E extends Element = Element>(
  element: E,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void
export function onEvent(element: any, type: any, listener: any, options?: any) {
  element.addEventListener(type, listener, options)
  return () => {
    element.removeEventListener(type, listener, options)
  }
}

export function onceEvent<M, K extends keyof M, E extends Element = Element>(
  element: E,
  type: K,
  listener: (this: E, ev: M[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onceEvent<K extends keyof BlComponentEventMap, E extends BlComponent = BlComponent>(
  element: E,
  type: K,
  listener: (this: E, ev: BlComponentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onceEvent<E extends Element = Element>(
  element: E,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void
export function onceEvent(element: any, type: any, listener: any, options?: any) {
  function wrapped(this: any, e: any) {
    element.removeEventListener(type, wrapped, options)
    listener.call(this, e)
  }
  element.addEventListener(type, wrapped, options)
  return () => {
    element.removeEventListener(type, wrapped, options)
  }
}
