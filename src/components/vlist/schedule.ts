export type Task = () => void
export type Schedule = (task: Task) => void

/**
 * 同步调度
 */
export const syncSchedule: Schedule = task => task()

/**
 * 异步调度
 */
export const asyncSchedule: Schedule = task => setTimeout(task, 0)
