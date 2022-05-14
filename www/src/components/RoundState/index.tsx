import React, { FC } from 'react';
import { Round } from '../../lib/types';
import Timer from '../Timer';

interface Props {
  round: Round;
}

const RoundState: FC<Props> = ({ round }) => {
  const timeLeft = round.roundEndTime - Date.now();

  return <div className="flex h-full">
    <div className="basis-1/4 flex flex-col justify-center items-center bg-gray text-white rounded">
      <div className="text-h7 2xl:text-h6">Банк</div>
      <div className="text-h5 2xl:text-h4 -mt-3 2xl:-mt-6">{round.roundBank || '100'}</div>
    </div>
    <div className="flex-1 flex justify-center items-center text-h5 2xl:text-h4">Раунд 1</div>
    <div className="basis-1/4 flex flex-col justify-center items-center bg-gray text-white rounded">
      <div className="text-h7 2xl:text-h6">Время</div>
      <div className="text-h5 2xl:text-h4 -mt-3 2xl:-mt-6">
        <Timer ms={timeLeft} />
      </div>
    </div>
  </div>;
};

export {
  RoundState,
};
