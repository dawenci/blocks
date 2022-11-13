import { Component, ComponentEventMap } from '../components/Component'

export function dispatchEvent<T = any>(
  element: Element,
  eventName: string,
  options: CustomEventInit = {}
): boolean {
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

export function onEvent<M, K extends keyof M>(
  element: Component & { disabled: boolean },
  type: K,
  listener: (this: typeof element, ev: M[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onEvent<K extends keyof ComponentEventMap>(
  element: Component & { disabled: boolean },
  type: K,
  listener: (this: typeof element, ev: ComponentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function onEvent(
  element: Component & { disabled: boolean },
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
