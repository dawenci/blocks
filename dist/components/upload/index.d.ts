import '../button/index.js';
import '../progress/index.js';
import { Component } from '../component/Component.js';
type Options = {
    includes?: any[];
    file: any;
};
declare enum State {
    Init = 0,
    Progress = 1,
    Success = 2,
    Error = 3,
    Abort = 4
}
export interface BlocksUpload extends Component {
    ref: {
        $layout: HTMLElement;
        $list: HTMLElement;
        $dropZone: HTMLElement;
        $fileInput: HTMLInputElement;
        $chooseButton: HTMLButtonElement;
    };
}
export declare class BlocksUpload extends Component {
    accessor accept: string | null;
    accessor action: string;
    accessor autoUpload: boolean;
    accessor disabled: boolean;
    accessor dragDrop: boolean;
    accessor multiple: boolean;
    accessor withCredentials: boolean;
    accessor name: string;
    _list: Array<{
        file: File;
        filename: string;
        state: State;
        progressValue: number;
        type: string;
        abort?: () => void;
    }>;
    _data: any;
    onProgress?: (data: any, options: Options) => void;
    onAbort?: (error: Error, options: Options) => void;
    onError?: (error: Error, options: Options) => void;
    onSuccess?: (data: any, options: Options) => void;
    constructor();
    get data(): any;
    set data(value: any);
    _headers: any;
    get headers(): any;
    set headers(value: any);
    _iconMap?: Record<string, RegExp | string | Array<string | RegExp>>;
    get iconMap(): Record<string, string | RegExp | (string | RegExp)[]> | undefined;
    set iconMap(value: Record<string, string | RegExp | (string | RegExp)[]> | undefined);
    get list(): {
        file: File;
        filename: string;
        state: State;
        progressValue: number;
        type: string;
        abort?: (() => void) | undefined;
    }[];
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, ov: any, v: any): void;
    upload(options?: Options): void;
    abortAll(): void;
    abortFile(file: File): void;
    clearFiles(): void;
    render(): void;
    _makeList(files: any[]): void;
    _renderList(): void;
    _parseType(input: string): string;
    _renderItemIcon($item: HTMLElement, fileType: string): void;
    _getItemByFile(file: File): {
        file: File;
        filename: string;
        state: State;
        progressValue: number;
        type: string;
        abort?: (() => void) | undefined;
    } | undefined;
    _onProgress(data: any, options: Options): void;
    _onAbort(error: any, options: Options): void;
    _onError(error: any, options: Options): void;
    _onSuccess(data: any, options: Options): void;
}
export {};
