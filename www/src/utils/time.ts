import { pad2 } from './string';
import { Milliseconds } from '../lib/types';

export function formatTime(time: Milliseconds) {
  const seconds = time / 1000;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 1) {
    return {
      minutes: '0',
      seconds: pad2(Math.floor(seconds)),
    };
  }

  const hours = Math.floor(minutes / 60);
  const remainSeconds = Math.floor(seconds % 60);
  const remainMinutes = minutes % 60;

  if (hours < 1) {
    return {
      minutes: remainMinutes.toString(10),
      seconds: pad2(remainSeconds),
    };
  }

  return {
    hours: hours.toString(10),
    minutes: pad2(remainMinutes),
    seconds: pad2(remainSeconds),
  };
}
