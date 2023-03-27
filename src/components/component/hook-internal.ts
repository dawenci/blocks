export type ConnectedCallback = () => void
export type DisconnectedCallback = () => void
export type AdoptedCallback = () => void
export type AttributeChangedCallback<StrArr extends readonly string[]> = (
  name: OneOf<StrArr>,
  oldValue: string | null,
  newValue: string | null
) => void
export type RenderCallback = () => void

let currentHook: Hook | null = null

export function setCurrentHook(hook: Hook) {
  currentHook = hook
}

export function getCurrentHook() {
  return currentHook
}

export const enum HookType {
  Connected,
  Disconnected,
  Adopted,
  AttributeChanged,
  Render,
}

export class Hook {
  hooks = Object.create(null)

  on(type: HookType, callback: (...args: any[]) => void) {
    const hooks = this.hooks[type] ?? (this.hooks[type] = [])
    hooks.push(callback)
  }

  call(ctx: any, type: HookType, ...args: any[]) {
    const hooks = this.hooks[type]
    if (!hooks) return
    for (let i = 0; i < hooks.length; i += 1) {
      hooks[i].apply(ctx, args)
    }
  }

  clear() {
    this.hooks = Object.create(null)
  }
}

export function clearHooks(hook: Hook) {
  hook.clear()
}

export function onConnected(hook: Hook, callback: ConnectedCallback) {
  hook.on(HookType.Connected, callback)
}

export function onDisconnected(hook: Hook, callback: DisconnectedCallback) {
  hook.on(HookType.Disconnected, callback)
}

export function onAdopted(hook: Hook, callback: AdoptedCallback) {
  hook.on(HookType.Adopted, callback)
}

export function onAttributeChanged<StrArr extends readonly string[] = string[]>(
  hook: Hook,
  callback: AttributeChangedCallback<StrArr>
) {
  hook.on(HookType.AttributeChanged, callback)
}

export function onAttributeChangedDep<Str extends string>(
  hook: Hook,
  callback: AttributeChangedCallback<[Str]>,
  dep: Str
) {
  function wrapped(this: any, name: Str, oldValue: string | null, newValue: string | null) {
    if (name === dep) callback.call(this, name, oldValue, newValue)
  }
  hook.on(HookType.AttributeChanged, wrapped)
}

export function onAttributeChangedDeps<StrArr extends readonly string[]>(
  hook: Hook,
  callback: AttributeChangedCallback<StrArr>,
  deps: StrArr
) {
  const depMap: Record<string, true> = Object.create(null)
  deps.forEach(dep => {
    depMap[dep] = true
  })
  function wrapped(this: any, name: string, oldValue: string | null, newValue: string | null) {
    if (depMap[name]) callback.call(this, name, oldValue, newValue)
  }
  hook.on(HookType.AttributeChanged, wrapped)
}

export function onRender(hook: Hook, callback: RenderCallback) {
  hook.on(HookType.Render, callback)
}
