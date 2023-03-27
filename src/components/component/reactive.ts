import { reactive } from '../../common/reactive.js'
import { Component } from './Component.js'

export const fromAttr = <Com extends Component, K extends keyof Com>(component: Com, attrName: K) => {
  const init = component[attrName]
  const observable = reactive<Com[K]>(init)
  const update = () => {
    observable.content = component[attrName]
  }
  component.onConnected(update)
  component.onAttributeChangedDep(attrName as string, update)
  return observable
}
