import { pad2 } from './string';
import { Milliseconds } from '../lib/types';

export function formatTime(time: Milliseconds): string {
  const seconds = time / 1000;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 1) {
    return ['0', pad2(Math.floor(seconds))].join(':');
  }

  const hours = Math.floor(minutes / 60);
  const remainSeconds = Math.floor(seconds % 60);
  const remainMinutes = minutes % 60;

  if (hours < 1) {
    return [remainMinutes.toString(10), pad2(remainSeconds)].join(':')
  }

  return [
    hours.toString(10),
    pad2(remainMinutes),
    pad2(remainSeconds),
  ].join(':');
}
