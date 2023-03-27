declare const enum NodeType {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
    COMMENT_NODE = 8,
    DOCUMENT_FRAGMENT_NODE = 11
}
export type IAttr = Attr | {
    name: string;
    value: string;
};
export type IAttributes = ArrayLike<IAttr>;
export declare class BlAttributes implements IAttributes {
    [index: number]: IAttr;
    length: number;
    constructor(props: Record<string, any>);
}
export interface IFragment {
    nodeType: NodeType.DOCUMENT_FRAGMENT_NODE;
    childNodes: ArrayLike<BlNode>;
}
export type IText = {
    nodeType: NodeType.TEXT_NODE;
    nodeValue: string;
};
export interface IElement {
    nodeType: NodeType.ELEMENT_NODE;
    nodeName: string;
    attributes: IAttributes;
    childNodes: ArrayLike<BlNode>;
    hasAttribute(name: string): boolean;
    getAttribute(name: string): string | null;
    setAttribute(name: string, value: string | null): void;
    removeAttribute(name: string): void;
}
export interface ITemplate extends IElement {
    content: IFragment;
}
export declare class BlFragment implements IFragment {
    childNodes: ArrayLike<BlNode>;
    nodeType: NodeType.DOCUMENT_FRAGMENT_NODE;
    constructor(childNodes: ArrayLike<BlNode>);
}
export declare class BlElement implements IElement {
    nodeName: string;
    attributes: IAttributes;
    childNodes: ArrayLike<BlNode>;
    nodeType: NodeType.ELEMENT_NODE;
    constructor(nodeName: string, attributes: IAttributes, childNodes: ArrayLike<BlNode>);
    hasAttribute(name: string): boolean;
    getAttribute(name: string): string | null;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
}
export declare class BlTemplate extends BlElement implements ITemplate {
    content: IFragment;
    constructor(content: IFragment);
}
export declare class BlText implements IText {
    nodeValue: string;
    nodeType: NodeType.TEXT_NODE;
    constructor(nodeValue: string);
}
export declare function isElem(node: BlNode): node is IElement | Element;
export declare function isFragment(node: unknown): node is IFragment | DocumentFragment;
export declare function isText(node: BlNode): node is IText | Text;
export declare function hasAttr(node: IElement | Element, name: string): boolean;
export declare function getAttr(node: IElement | Element, name: string): string | null;
export declare function getAttrs(node: IElement | Element): ArrayLike<IAttr>;
export declare function children(node: BlNode | IFragment | DocumentFragment): BlNode[];
export type BlNode = IElement | ITemplate | IText | Element | Text | ChildNode;
export { BlNode as t };
