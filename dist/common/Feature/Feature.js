import { Hook } from '../Hook/index.js';
export class Feature {
    id;
    component;
    static make(id, component) {
        return new this(id, component);
    }
    hook = new Hook();
    constructor(id, component) {
        this.id = id;
        this.component = component;
        this.init();
        if (!component.getFeature(id)) {
            component.addFeature(id, this);
        }
    }
    init() {
    }
}
