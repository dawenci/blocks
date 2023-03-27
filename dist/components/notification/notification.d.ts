import type { NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
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
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: NullableEnumAttr<typeof notificationTypes>;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
