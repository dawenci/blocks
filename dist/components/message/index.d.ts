import '../close-button/index.js';
import { BlComponent } from '../component/Component.js';
export declare class BlMessage extends BlComponent {
    #private;
    accessor closeable: boolean;
    accessor duration: number;
    accessor type: MaybeOneOf<['message', 'success', 'error', 'info', 'warning']>;
    accessor $layout: HTMLElement;
    accessor $icon: HTMLElement;
    accessor $content: HTMLElement;
    accessor $close: HTMLButtonElement;
    constructor();
    close(): void;
    render(): void;
    destroy(): void;
    _autoCloseTimer?: ReturnType<typeof setTimeout>;
    _clearAutoClose(): void;
    _setAutoClose(): void;
}
