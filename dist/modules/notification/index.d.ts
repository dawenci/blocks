import '../../components/notification/index.js';
import { NotificationPlacement } from '../../components/notification/index.js';
type NotifyOptions = {
    type?: any;
    closeable?: boolean;
    duration?: number;
    content?: string;
    title?: string;
    placement?: NotificationPlacement;
};
export declare function blNotify(options?: NotifyOptions): {
    el: import("../../components/notification/notification").BlNotification;
    close(): any;
    onclose(callback: () => void): any;
};
export {};
