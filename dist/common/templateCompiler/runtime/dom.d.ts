export declare function fragment(): DocumentFragment;
export declare function element<K extends keyof HTMLElementTagNameMap>(name: K): HTMLElementTagNameMap[K];
export declare function text(data: string): Text;
export declare function comment(text?: string): Comment;
export declare function space(): Text;
export declare function empty(): Text;
export declare function attr(node: Element, attribute: string, value?: string): void;
export declare function prop(node: Element, prop: string, value?: any): void;
export declare function append(target: Node, node: Node): Node;
export declare function insert(target: Node, node: Node, anchor?: Node | null): Node;
export declare function before(anchor: Node, node: Node): Node;
export declare function detach(node: Node): void;
export declare function replace(node: Node, anchor: Node): Node;
export declare function next(node: Node): ChildNode | null;
export declare function prev(node: Node): ChildNode | null;
export declare function event(node: Node, eventType: string, handle: ((e: Event) => void) | null, eventFlag?: number): void;
export declare function parseHtml(html: string): Node[];
