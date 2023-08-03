import { computed, reactive } from '../../common/reactive.js'
import { BlComponent } from './Component.js'

export const fromAttr = <Com extends BlComponent, K extends keyof Com>(component: Com, attrName: K) => {
  const init = component[attrName]
  const observable = reactive<Com[K]>(init)
  const update = () => {
    observable.content = component[attrName]
  }
  component.hook.onConnected(update)
  component.hook.onAttributeChangedDep(attrName as string, update)

  return computed(v => v, [observable])
}
