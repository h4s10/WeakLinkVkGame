import React, { FC } from 'react';
import Timer from '../Timer';
import { Timestamp } from '../../lib/types';
import { formatTime } from '../../utils/time';

interface Props {
  name: string,
  bank: number,
  running?: boolean,
  endsAt: Timestamp
}

const RoundInfo: FC<Props> = ({ name, bank, endsAt, running = false }) => {
  const timeLeft = endsAt - Date.now();

  return <div className="flex h-full">
    <div className="basis-1/4 flex flex-col justify-center items-center bg-gray text-white rounded">
      <div className="text-h7 2xl:text-h6">Банк</div>
      <div className="text-h5 2xl:text-h4 -mt-3 2xl:-mt-6">{bank}</div>
    </div>
    <div className="flex-1 flex justify-center items-center text-h5 2xl:text-h4">{name}</div>
    <div className="basis-1/4 flex flex-col justify-center items-center bg-gray text-white rounded">
      <div className="text-h7 2xl:text-h6">Время</div>
      <div className="text-h5 2xl:text-h4 -mt-3 2xl:-mt-6">
        { running ? <Timer ms={timeLeft} /> : formatTime(timeLeft) }
      </div>
    </div>
  </div>;
};

export {
  RoundInfo,
};
