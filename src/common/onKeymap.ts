export type Handler<This> = (this: This, ev: KeyboardEvent) => any

export interface KeyBinding<Ctx> {
  key: string
  handler: Handler<Ctx>
  eventType?: 'keydown' | 'keyup' | 'keypress'
  ctx?: Ctx
  capture?: boolean
}

export interface KeyBindingGroup {
  eventType: 'keydown' | 'keyup' | 'keypress'
  bindings: KeyBinding<any>[]
  capture: boolean
}

function groupBindings(bindings: KeyBinding<any>[]): KeyBindingGroup[] {
  // 分组
  const map: {
    keydown: KeyBinding<any>[] | undefined
    keydownCapture: KeyBinding<any>[] | undefined
    keyup: KeyBinding<any>[] | undefined
    keyupCapture: KeyBinding<any>[] | undefined
    keypress: KeyBinding<any>[] | undefined
    keypressCapture: KeyBinding<any>[] | undefined
  } = Object.create(null)

  for (let i = 0; i < bindings.length; ++i) {
    const binding = bindings[i]
    const type = binding.eventType || 'keydown'
    switch (type) {
      case 'keydown':
        if (binding.capture) {
          map.keydownCapture = map.keydownCapture || []
          map.keydownCapture.push(binding)
        } else {
          map.keydown = map.keydown || []
          map.keydown.push(binding)
        }
        break
      case 'keyup':
        if (binding.capture) {
          map.keyupCapture = map.keyupCapture || []
          map.keyupCapture.push(binding)
        } else {
          map.keyup = map.keyup || []
          map.keyup.push(binding)
        }
        break

      default:
        if (binding.capture) {
          map.keypressCapture = map.keypressCapture || []
          map.keypressCapture.push(binding)
        } else {
          map.keypress = map.keypress || []
          map.keypress.push(binding)
        }
    }
  }

  const groups: KeyBindingGroup[] = []
  if (map.keydown) groups.push({ eventType: 'keydown', bindings: map.keydown!, capture: false })
  if (map.keydownCapture) groups.push({ eventType: 'keydown', bindings: map.keydown!, capture: true })
  if (map.keyup) groups.push({ eventType: 'keyup', bindings: map.keyup!, capture: false })
  if (map.keyupCapture) groups.push({ eventType: 'keyup', bindings: map.keyup!, capture: true })
  if (map.keypress) groups.push({ eventType: 'keypress', bindings: map.keypress!, capture: false })
  if (map.keypressCapture) groups.push({ eventType: 'keypress', bindings: map.keypress!, capture: true })
  return groups
}

export function onKeymap($el: HTMLElement | Document | Window, bindings: KeyBinding<any>[]) {
  let handlers: WeakMap<KeyBindingGroup, Handler<any>> | undefined = new WeakMap()
  let groups = groupBindings(bindings)

  for (let i = 0; i < groups.length; ++i) {
    const group = groups[i]
    function handler(this: any, e: KeyboardEvent) {
      if (e.defaultPrevented) return
      for (let i = 0; i < group.bindings.length; ++i) {
        const binding = group.bindings[i]
        const parsedKey = parseKey(binding.key)
        if (parsedKey.ctrlKey && !e.ctrlKey) return
        if (parsedKey.shiftKey && !e.shiftKey) return
        if (parsedKey.altKey && !e.altKey) return
        if (parsedKey.keyName === eventKeyName(e)) {
          binding.handler.call(binding.ctx ?? this, e)
        }
      }
    }
    handlers.set(group, handler)
    $el.addEventListener(group.eventType, handler as EventListener, group.capture)
  }

  return function cleanup() {
    if (!groups.length) return
    for (let i = 0; i < groups.length; ++i) {
      const group = groups[i]
      const handler = handlers!.get(group)
      $el.removeEventListener(group.eventType, handler as EventListener, group.capture)
    }
    groups = []
    handlers = undefined
  }
}

function eventKeyName(e: KeyboardEvent): string {
  return e.key.toLowerCase?.() ?? ''
}

function parseKey(key: string): {
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  keyName: string
} {
  let ctrlKey = false
  let shiftKey = false
  let altKey = false
  let keyName = ''

  key
    .toLowerCase()
    .split('-')
    .forEach(k => {
      if (k === 'ctrl') ctrlKey = true
      else if (k === 'shift') shiftKey = true
      else if (k === 'alt') altKey = true
      keyName = k
    })

  return {
    ctrlKey,
    shiftKey,
    altKey,
    keyName,
  }
}
