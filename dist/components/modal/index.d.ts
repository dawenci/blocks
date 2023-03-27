import type { BlocksButton } from '../button/index.js';
import '../button/index.js';
import '../dialog/index.js';
import '../input/index.js';
import { BlocksDialog } from '../dialog/index.js';
export interface BlocksModal extends BlocksDialog {
    onConfirm?: (value: any) => any;
    onCancel?: (value: any) => any;
}
export declare class BlocksModal extends BlocksDialog {
    #private;
    static get observedAttributes(): string[];
    accessor withConfirm: boolean;
    accessor withCancel: boolean;
    accessor confirmText: string | null;
    accessor cancelText: string | null;
    accessor rich: boolean;
    accessor content: string | null;
    get $confirmButton(): BlocksButton | null;
    get $cancelButton(): BlocksButton | null;
    get $content(): HTMLElement | null;
    constructor();
    get resolveValue(): any;
    set resolveValue(value: any);
    get rejectValue(): string | (() => any) | null;
    set rejectValue(value: string | (() => any) | null);
    get promise(): Promise<any> | undefined;
    cancel(): void;
    confirm(): void;
}
