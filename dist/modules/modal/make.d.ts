import '../../components/modal/index.js';
export interface ModalOptions {
    cancel?: boolean;
    richMode?: boolean;
    cancelText?: string;
    confirmText?: string;
    onCancel?: (err: any) => any;
    onConfirm?: (value: any) => any;
    resolveValue?: () => any;
    rejectValue?: () => any;
}
export declare function modal(text: string, options?: ModalOptions): {
    promise: Promise<any>;
    $dialog: import("../../components/modal/index.js").BlModal;
};
