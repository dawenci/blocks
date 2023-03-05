import { Component } from '../Component.js';
import type { NullableEnumAttr } from '../../decorators/attr.js';
export declare enum NotificationPlacement {
    TopRight = "top-right",
    BottomRight = "bottom-right",
    BottomLeft = "bottom-left",
    TopLeft = "top-left"
}
export declare enum NotificationType {
    Message = "message",
    Success = "success",
    Error = "error",
    Info = "info",
    Warning = "warning"
}
export declare const notificationTypes: NotificationType[];
export interface BlocksNotification extends Component {
    ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $content: HTMLElement;
        $close?: HTMLButtonElement;
    };
}
export declare class BlocksNotification extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: NullableEnumAttr<typeof notificationTypes>;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
