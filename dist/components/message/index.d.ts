import type { NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
export interface BlocksMessage extends Component {
    _ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $content: HTMLElement;
        $close?: HTMLButtonElement;
    };
}
export declare class BlocksMessage extends Component {
    #private;
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: NullableEnumAttr<['message', 'success', 'error', 'info', 'warning']>;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    _autoCloseTimer?: ReturnType<typeof setTimeout>;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
