import { BlModel } from '../../BlModel.js';
export declare const resolve: <T extends object>(env: BlModel<T>, key: keyof T, ...path: (keyof T)[]) => any;
