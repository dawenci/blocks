import { Event } from '../Event/Event.js'
import { HookType, HookEventMap } from './type.js'

export class HookEvent extends Event<HookEventMap> {
  override merge(hook: HookEvent) {
    const data = hook._data
    ;[HookType.Connected, HookType.Disconnected, HookType.Adopted, HookType.AttributeChanged, HookType.Render].forEach(
      type => {
        if (data[type]) {
          data[type].forEach((callback: HookEventMap[HookType]) => {
            this.on(type, callback)
          })
        }
      }
    )
  }
}
