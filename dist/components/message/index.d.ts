import { Component } from '../Component.js';
import type { NullableEnumAttr } from '../../decorators/attr.js';
export interface BlocksMessage extends Component {
    _ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $content: HTMLElement;
        $close?: HTMLButtonElement;
    };
}
export declare class BlocksMessage extends Component {
    static get observedAttributes(): string[];
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: NullableEnumAttr<[
        'message',
        'success',
        'error',
        'info',
        'warning'
    ]>;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _autoCloseTimer?: number;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
export interface MessageOptions {
    type?: any;
    closeable?: boolean;
    duration?: number;
    content?: string;
}
export declare function blMessage(options?: MessageOptions): {
    el: BlocksMessage;
    close(): any;
    onclose(callback: () => void): any;
};
