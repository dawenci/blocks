import '../button/index.js';
import '../progress/index.js';
import { Component } from '../Component.js';
declare type Options = {
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
declare type DomRef = {
    $layout: HTMLElement;
    $list: HTMLElement;
    $dropZone: HTMLElement;
    $fileInput: HTMLInputElement;
    $chooseButton: HTMLButtonElement;
};
export declare class BlocksUpload extends Component {
    ref: DomRef;
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
    get accept(): string | null;
    set accept(value: string | null);
    get action(): string;
    set action(value: string);
    get autoUpload(): boolean;
    set autoUpload(value: boolean);
    get data(): any;
    set data(value: any);
    get disabled(): boolean;
    set disabled(value: boolean);
    get dragDrop(): boolean;
    set dragDrop(value: boolean);
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
    get multiple(): boolean;
    set multiple(value: boolean);
    get name(): string;
    set name(value: string);
    get withCredentials(): boolean;
    set withCredentials(value: boolean);
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
    static get observedAttributes(): string[];
}
export {};
