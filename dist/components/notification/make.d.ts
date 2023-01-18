import './notification.js';
import { NotificationPlacement } from './notification.js';
declare type NotifyOptions = {
    type?: any;
    dark?: any;
    closeable?: boolean;
    duration?: number;
    content?: string;
    title?: string;
    placement?: NotificationPlacement;
};
export declare function blNotify(options?: NotifyOptions): {
    el: import("./notification.js").BlocksNotification;
    close(): any;
    onclose(callback: () => void): any;
};
export {};
