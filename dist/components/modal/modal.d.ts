import { BlocksDialog } from '../dialog/index.js';
import { BlocksButton } from '../button/index.js';
export interface BlocksModal extends BlocksDialog {
    _ref: BlocksDialog['_ref'] & {
        $content?: HTMLElement;
        $confirmButton?: BlocksButton;
        $cancelButton?: BlocksButton;
    };
    onConfirm?: (value: any) => any;
    onCancel?: (value: any) => any;
}
export declare class BlocksModal extends BlocksDialog {
    #private;
    static get observedAttributes(): string[];
    constructor();
    get withConfirm(): boolean;
    set withConfirm(value: boolean);
    get withCancel(): boolean;
    set withCancel(value: boolean);
    get confirmText(): string | null;
    set confirmText(value: string | null);
    get cancelText(): string | null;
    set cancelText(value: string | null);
    get resolveValue(): any;
    set resolveValue(value: any);
    get rejectValue(): string | (() => any) | null;
    set rejectValue(value: string | (() => any) | null);
    get rich(): boolean;
    set rich(value: boolean);
    get content(): string | null;
    set content(value: string | null);
    get promise(): Promise<any> | undefined;
    cancel(): void;
    confirm(): void;
    _renderContent(): void;
    _renderCancel(): void;
    _renderConfirm(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
