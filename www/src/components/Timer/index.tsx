import React, { FC, useState, useEffect } from 'react';
import { Milliseconds } from '../../lib/types';
import cn from 'classnames';
import { formatTime } from '../../utils/time';

interface Props {
  ms: Milliseconds;
}

const Timer: FC<Props> = ({ ms }) => {
  const [left, setTime] = useState(ms);

  function refreshClock() {
    setTime(Math.max(0, left - 1000));
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, [left]);

  if (!left) {
    return <span>-</span>;
  }

  const construct = formatTime(left);

  return (
    <span className={cn({
      'animate-ping': left === 0,
    })}>
      {construct.hours ? construct.hours + ':' : ''}{construct.minutes}:{construct.seconds}
    </span>
  );
};
export default Timer;
