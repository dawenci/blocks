import { Component } from '../Component.js';
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
declare type DomRef = {
    $layout: HTMLElement;
    $icon: HTMLElement;
    $content: HTMLElement;
    $close?: HTMLButtonElement;
};
export declare class BlocksNotification extends Component {
    #private;
    ref: DomRef;
    static get observedAttributes(): string[];
    constructor();
    get closeable(): boolean;
    set closeable(value: boolean);
    get type(): NotificationType | null;
    set type(value: NotificationType | null);
    get duration(): number;
    set duration(value: number);
    close(): void;
    render(): void;
    destroy(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
export {};
