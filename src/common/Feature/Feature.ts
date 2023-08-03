import { BlComponent } from '../../components/component/Component.js'
import { Hook } from '../Hook/index.js'

export class Feature<T extends BlComponent = BlComponent> {
  static make<T extends BlComponent = BlComponent>(id: string | symbol, component: T) {
    return new this(id, component)
  }

  hook = new Hook()

  constructor(public id: string | symbol, public component: T) {
    this.init()

    if (!component.getFeature(id)) {
      component.addFeature(id, this)
    }
  }

  init() {
    //
  }
}
