import type { Context, IfContext, ForContext, HtmlContext } from './Context.js';
import { EnvRecord } from './EnvRecord.js';
export declare const enum BindingType {
    Attr = 0,
    Text = 1,
    Event = 2,
    If = 3,
    For = 4,
    Html = 5
}
export type Binding = AttrBinding | EventBinding | TextBinding | IfBinding | ForBinding | HtmlBinding;
declare class BindingBase {
    isIndex?: boolean;
    get env(): EnvRecord;
    get envName(): string;
    get dataKey(): string;
    get resolved(): string;
}
export declare class IfBinding extends BindingBase {
    context: Context;
    childCtx: IfContext;
    varName: string;
    rawDataKey: string;
    readonly type = BindingType.If;
    constructor(context: Context, childCtx: IfContext, varName: string, rawDataKey: string);
}
export declare class AttrBinding extends BindingBase {
    context: Context;
    varName: string;
    rawDataKey: string;
    attrName: string;
    attrVal: string;
    isProp: boolean;
    readonly type = BindingType.Attr;
    constructor(context: Context, varName: string, rawDataKey: string, attrName: string, attrVal: string, isProp: boolean);
}
export declare class EventBinding extends BindingBase {
    context: Context;
    varName: string;
    rawDataKey: string;
    attrVal: string;
    eventType: string;
    eventFlag: number;
    readonly type = BindingType.Event;
    constructor(context: Context, varName: string, rawDataKey: string, attrVal: string, eventType: string, eventFlag: number);
}
export declare class TextBinding extends BindingBase {
    context: Context;
    varName: string;
    rawDataKey: string;
    readonly type = BindingType.Text;
    constructor(context: Context, varName: string, rawDataKey: string);
}
export declare class ForBinding extends BindingBase {
    context: Context;
    forCtx: ForContext;
    varName: string;
    rawDataKey: string;
    readonly type = BindingType.For;
    constructor(context: Context, forCtx: ForContext, varName: string, rawDataKey: string);
}
export declare class HtmlBinding extends BindingBase {
    context: Context;
    childCtx: HtmlContext;
    varName: string;
    rawDataKey: string;
    readonly type = BindingType.Html;
    constructor(context: Context, childCtx: HtmlContext, varName: string, rawDataKey: string);
}
export declare function getEnv(binding: Binding): EnvRecord;
export declare function getDataKey(binding: Binding): string;
export {};
