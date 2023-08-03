import { BlComponent } from '../component/Component.js';
export declare class BlBreadcrumbItem extends BlComponent {
    #private;
    accessor href: string;
    accessor $separator: HTMLDivElement;
    accessor $link: HTMLAnchorElement;
    constructor();
    _renderSeparator(separator: string): void;
}
