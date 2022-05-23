import { createEvent, createStore } from 'effector-logger';
import { ROUND_TIME } from '../settings';

export const endsAt = createStore<number>(null, { name: 'Timer end timestamp' });
export const active = createStore<boolean>(false, { name: 'Timer active' });

export const start = createEvent<number | void>('Start timer');
export const clear = createEvent('Clear timer');

let id = 0;

endsAt.on(start, (prev, time: number = ROUND_TIME) => Date.now() + time);
endsAt.reset(clear);

active.on(start, () => true);
active.on(clear, () => false);

endsAt.watch(ts => {
  globalThis.clearInterval(id);
  if (ts) {
    id = globalThis.setTimeout(clear, ts - Date.now());
  }
});

(window as any).debug = {
  ...(window as any).debug ?? {},
  startTimer: start,
  clearTimer: clear,
}
