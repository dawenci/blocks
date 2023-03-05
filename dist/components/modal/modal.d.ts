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
    accessor withConfirm: boolean;
    accessor withCancel: boolean;
    accessor rich: boolean;
    accessor confirmText: string | null;
    accessor cancelText: string | null;
    accessor content: string | null;
    constructor();
    get resolveValue(): any;
    set resolveValue(value: any);
    get rejectValue(): string | (() => any) | null;
    set rejectValue(value: string | (() => any) | null);
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
