import '../../components/message/index.js';
export interface MessageOptions {
    type?: any;
    closeable?: boolean;
    duration?: number;
    content?: string;
}
export declare function blMessage(options?: MessageOptions): {
    el: import("../../components/message/index.js").BlocksMessage;
    close(): any;
    onclose(callback: () => void): any;
};
