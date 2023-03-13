import { Component, ComponentEventMap } from '../components/Component'

// 组件内部 disabled 状态时候，要阻止事件传播，就需要使用捕获模式，
// 否则因为在组件外面写的捕获模式的事件绑定，会更早触发，导致无法成功阻止
export function captureEventWhenEnable<M, K extends keyof M>(
  element: Component & { disabled: boolean },
  eventType: K,
  callback: (e: M[K]) => any
): any
export function captureEventWhenEnable<K extends keyof ComponentEventMap>(
  element: Component & { disabled: boolean },
  eventType: K,
  callback: (e: ComponentEventMap[K]) => any
): any
export function captureEventWhenEnable(
  element: Component & { disabled: boolean },
  eventType: string,
  callback: (e: Event) => any
): any
export function captureEventWhenEnable(element: any, eventType: any, callback: any) {
  element.addEventListener(
    eventType,
    (e: any) => {
      if (element.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      callback(e)
    },
    true
  )
}
