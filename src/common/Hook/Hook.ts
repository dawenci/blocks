import {
  HookType,
  ConnectedCallback,
  DisconnectedCallback,
  AdoptedCallback,
  AttributeChangedCallback,
  RenderCallback,
} from './type.js'
import { HookEvent } from './HookEvent.js'

export class Hook {
  _hookEv_ = new HookEvent()

  clear() {
    this._hookEv_.offAll()
  }

  onConnected(callback: ConnectedCallback) {
    this._hookEv_.on(HookType.Connected, callback)
  }

  callConnected(ctx: any) {
    this._hookEv_.triggerWithArgsCtx(ctx, HookType.Connected)
  }

  onDisconnected(callback: DisconnectedCallback) {
    this._hookEv_.on(HookType.Disconnected, callback)
  }

  callDisconnected(ctx: any) {
    this._hookEv_.triggerWithArgsCtx(ctx, HookType.Disconnected)
  }

  onAdopted(callback: AdoptedCallback) {
    this._hookEv_.on(HookType.Adopted, callback)
  }

  callAdopted(ctx: any) {
    this._hookEv_.triggerWithArgsCtx(ctx, HookType.Adopted)
  }

  onAttributeChanged<StrArr extends readonly string[] = readonly string[]>(callback: AttributeChangedCallback<StrArr>) {
    this._hookEv_.on(HookType.AttributeChanged, callback)
  }

  callAttributeChanged(ctx: any, ...args: any[]) {
    this._hookEv_.triggerWithArgsCtx(ctx, HookType.AttributeChanged, ...args)
  }

  onAttributeChangedDep<Str extends string>(dep: Str, callback: AttributeChangedCallback<[Str]>) {
    function wrapped(this: any, name: Str, oldValue: string | null, newValue: string | null) {
      if (name === dep) callback.call(this, name, oldValue, newValue)
    }
    this._hookEv_.on(HookType.AttributeChanged, wrapped)
  }

  onAttributeChangedDeps<StrArr extends readonly string[]>(deps: StrArr, callback: AttributeChangedCallback<StrArr>) {
    const depMap: Record<string, true> = Object.create(null)
    deps.forEach(dep => {
      depMap[dep] = true
    })
    function wrapped(this: any, name: string, oldValue: string | null, newValue: string | null) {
      if (depMap[name]) callback.call(this, name, oldValue, newValue)
    }
    this._hookEv_.on(HookType.AttributeChanged, wrapped)
  }

  onRender(callback: RenderCallback) {
    this._hookEv_.on(HookType.Render, callback)
  }

  callRender(ctx: any) {
    this._hookEv_.triggerWithArgsCtx(ctx, HookType.Render)
  }

  merge(other: Hook) {
    this._hookEv_.merge(other._hookEv_)
  }
}
