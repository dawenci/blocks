export const syncSchedule = task => task();
export const asyncSchedule = task => setTimeout(task, 0);
