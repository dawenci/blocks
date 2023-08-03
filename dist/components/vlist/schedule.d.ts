export type Task = () => void;
export type Schedule = (task: Task) => void;
export declare const syncSchedule: Schedule;
export declare const asyncSchedule: Schedule;
