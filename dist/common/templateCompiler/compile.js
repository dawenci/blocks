import * as runtime from './runtime/index.js';
import { generateCode } from './generate.js';
export function compile(root) {
    const { code } = generateCode(root);
    console.time('COMPILE_CODE');
    const result = new Function('{dom,noop,resolve,BlModel,BlEvent}', '{model}={}', code).bind(null, Object.assign(runtime));
    console.timeEnd('COMPILE_CODE');
    return {
        get make() {
            return result;
        },
        get code() {
            return code;
        },
    };
}
