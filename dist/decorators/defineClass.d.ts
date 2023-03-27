type ClassOptions = {
    mixins?: any[];
    styles?: string[];
    customElement?: string;
    attachShadow?: boolean | ShadowRootInit;
};
export declare function defineClass<T extends CustomElementConstructor>(options: ClassOptions): (target: T, ctx: ClassDecoratorContext<T>) => void;
export declare function defineClass<T extends CustomElementConstructor>(target: T, ctx: ClassDecoratorContext<T>): void;
export declare function handleMembers<T extends CustomElementConstructor>(target: T): void;
export declare function appendObservedAttributes<T extends CustomElementConstructor>(target: T, observedAttrs: string[]): void;
export declare function appendUpgradeProperties<T extends CustomElementConstructor>(target: T, upgradeProps: string[]): void;
export declare function appendComponentStyles<T extends CustomElementConstructor>(target: T, $fragment: DocumentFragment | HTMLStyleElement): void;
export {};
