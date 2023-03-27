import { ENV_PREFIX } from './constants.js';
export var EnvType;
(function (EnvType) {
    EnvType[EnvType["Root"] = 0] = "Root";
    EnvType[EnvType["For"] = 1] = "For";
})(EnvType || (EnvType = {}));
class EnvRecord {
    static uid = 0;
    type;
    rawName;
    name;
    constructor(type, rawName) {
        this.type = type;
        this.rawName = rawName;
        this.name = `${ENV_PREFIX}${++EnvRecord.uid}`;
    }
    static root() {
        return new EnvRecord(0, 'root');
    }
    static for(rawName) {
        return new EnvRecord(1, rawName);
    }
}
export { EnvRecord };
