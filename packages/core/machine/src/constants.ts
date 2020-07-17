import { TimerStartEventType, TimerClearEventType, AssignAction, InitEvent } from './types';

export const ASSIGN_ACTION: AssignAction = 'interop.assign';
export const INIT_EVENT: InitEvent = { type: 'interop.init' };
export const TIMER_CLEAR_EVENT_TYPE: TimerClearEventType = 'interop.clear-timer';
export const TIMER_START_EVENT_TYPE: TimerStartEventType = 'interop.start-timer';
export const TIMER_CLEAR_ACTION: TimerClearEventType = 'interop.clear-timer';
export const TIMER_START_ACTION: TimerStartEventType = 'interop.start-timer';
