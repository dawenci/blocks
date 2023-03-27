import * as internal from './hook-internal.js'

/**
 * 只能在 constructor 中使用
 */
export function onConnected(callback: internal.ConnectedCallback) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onConnected(currentHook, callback)
}

/**
 * 只能在 constructor 中使用
 */
export function onDisconnected(callback: internal.DisconnectedCallback) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onDisconnected(currentHook, callback)
}

/**
 * 只能在 constructor 中使用
 */
export function onAdopted(callback: internal.AdoptedCallback) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onAdopted(currentHook, callback)
}

/**
 * 只能在 constructor 中使用
 */
export function onAttributeChanged<StrArr extends readonly string[] = string[]>(
  callback: internal.AttributeChangedCallback<StrArr>
) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onAttributeChanged(currentHook, callback)
}

/**
 * 只能在 constructor 中使用
 */
export function onAttributeChangedDep<Str extends string = string>(
  callback: internal.AttributeChangedCallback<[Str]>,
  dep: Str
) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onAttributeChangedDep(currentHook, callback, dep)
}

/**
 * 只能在 constructor 中使用
 */
export function onAttributeChangedDeps<StrArr extends readonly string[] = string[]>(
  callback: internal.AttributeChangedCallback<StrArr>,
  deps: StrArr
) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onAttributeChangedDeps(currentHook, callback, deps)
}

/**
 * 只能在 constructor 中使用
 */
export function onRender(callback: internal.RenderCallback) {
  const currentHook = internal.getCurrentHook()
  if (currentHook) internal.onRender(currentHook, callback)
}
