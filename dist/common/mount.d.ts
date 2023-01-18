export declare const prepend: <T extends Node>($el: T, $parent: Node) => T;
export declare const append: <T extends Node>($el: T, $parent: Node) => T;
export declare const mountBefore: <T extends Node>($el: T, $exists: Node) => T;
export declare const mountAfter: <T extends Node>($el: T, $exists: Node) => T;
export declare const unmount: <T extends Node>($el: T) => T;
