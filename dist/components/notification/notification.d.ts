import { BlComponent } from '../component/Component.js';
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
export interface BlNotification extends BlComponent {
    ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $content: HTMLElement;
        $close?: HTMLButtonElement;
    };
}
export declare class BlNotification extends BlComponent {
    #private;
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: MaybeOneOf<typeof notificationTypes>;
    accessor $layout: HTMLElement;
    accessor $icon: HTMLElement;
    accessor $content: HTMLElement;
    accessor $close: HTMLElement;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
