import { BlComponent } from './Component.js';
export declare const fromAttr: <Com extends BlComponent, K extends keyof Com>(component: Com, attrName: K) => import("../../common/reactive.js").IReactive<Com[K]>;
