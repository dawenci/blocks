import { Feature } from '../../common/Feature/Feature.js'
import { BlComponent } from '../component/Component.js'

export class AriaFeature<T extends BlComponent & { checked: boolean }> extends Feature<T> {
  override init() {
    const update = () => {
      this.component.setAttribute('aria-checked', this.component.checked ? 'true' : 'false')
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('checked', update)
  }
}
