import { Component } from '../component/Component.js';
export declare class BlocksBreadcrumbItem extends Component {
    #private;
    accessor href: string;
    accessor $separator: HTMLDivElement;
    accessor $link: HTMLAnchorElement;
    constructor();
    _renderSeparator(separator: string): void;
}
