import { ENV_PREFIX } from './constants.js';
export var EnvType;
(function (EnvType) {
    EnvType[EnvType["Root"] = 0] = "Root";
    EnvType[EnvType["For"] = 1] = "For";
})(EnvType || (EnvType = {}));
export class EnvRecord {
    type;
    rawName;
    name;
    constructor(type, name) {
        this.type = type;
        this.rawName = name;
        this.name = ENV_PREFIX + name;
    }
    static root() {
        return new EnvRecord(0, 'root');
    }
    static for(name) {
        return new EnvRecord(1, name);
    }
}
