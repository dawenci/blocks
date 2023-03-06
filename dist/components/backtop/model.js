import { BlModel } from '../../common/BlModel.js';
class BacktopModel extends BlModel {
    data = {
        scrolled: 0,
        duration: 0,
        threshold: 400,
        visible: false,
    };
    constructor() {
        super();
        this.on('update:scrolled update:threshold', () => {
            this.set('visible', this.data.scrolled >= this.data.threshold);
        });
    }
}
export const make = () => new BacktopModel();
