import type { Binding } from './Binding.js';
import { EnvRecord } from './EnvRecord.js';
import { Code } from './Code.js';
export declare const enum ContextType {
    Root = 0,
    If = 1,
    For = 2,
    Html = 3
}
export declare class ContextBase {
    type: ContextType;
    codeMaker: Code;
    _elementCount: number;
    _textCount: number;
    _ifCount: number;
    _forCount: number;
    _htmlCount: number;
    _attrCount: number;
    _topElements: number[];
    _topTexts: number[];
    _topIfs: number[];
    _topFors: number[];
    _topHtmls: number[];
    _ownBindings: Binding[];
    _ownFreeBindings: Binding[];
    _ownDepEnvNames: string[];
    _envs: EnvRecord[];
    _rootCtx: RootContext;
    _parentCtx: Context;
    _childrenCtx: Context[];
    topLevelVars: string[];
    get isStatic(): boolean;
    _hasFreeBinding?: boolean;
    get hasFreeBinding(): boolean;
    get allFreeBindings(): Binding[];
    get parentCtx(): Context;
    set parentCtx(ctx: Context);
    get rootCtx(): RootContext;
    get closestEnvCtx(): RootContext | ForContext;
    get env(): EnvRecord;
    get envName(): string;
    get envs(): EnvRecord[];
    get envNames(): string;
    getCode(): string;
    declareIf(isTop?: boolean): string;
    declareFor(isTop?: boolean): string;
    declareHtml(isTop?: boolean): string;
    declareElement(isTop?: boolean): string;
    declareText(isTop?: boolean): string;
    declareAttr(): string;
    getAllVars(sep: string): string;
    addBinding(binding: Binding): void;
}
export declare class RootContext extends ContextBase {
    readonly type: ContextType.Root;
    _childBlockMakerCodes: string[];
    constructor();
}
export declare class IfContext extends ContextBase {
    static uid: number;
    readonly type: ContextType.If;
    varName: string;
    dataKey: string;
    makeFuncName: string;
    constructor(varName: string, dataKey: string, parentCtx: Context);
}
export declare class ForContext extends ContextBase {
    static uid: number;
    readonly type: ContextType.For;
    varName: string;
    dataKey: string;
    makeFuncName: string;
    constructor(varName: string, dataKey: string, newEnv: string, parentCtx: Context);
}
export declare class HtmlContext extends ContextBase {
    static uid: number;
    readonly type: ContextType.Html;
    varName: string;
    dataKey: string;
    makeFuncName: string;
    constructor(varName: string, dataKey: string, parentCtx: Context);
}
export type Context = RootContext | IfContext | ForContext | HtmlContext;
