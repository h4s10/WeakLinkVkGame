import React, { FC } from 'react';
import cn from 'classnames';

import Avatar from '../../../assets/avatarSmall.svg';
import SmileyCorrect from '../../../assets/smileyCorrect.svg';
import SmileyIncorrect from '../../../assets/smileyIncorrect.svg';
import SmileyBank from '../../../assets/smileyBank.svg';
import { UserRound } from '../../lib/api';

import './player.css';

interface Props {
  player: UserRound;
  isCurrent?: boolean;
  isOut?: boolean;
}

const PlayerCard: FC<Props> = ({ player, isCurrent = false, isOut = false }) => {
  const position = {
    top: Math.random() * (90 - 10 - 10) + 10,
    left: Math.random() * (90 - 10 - 10) + 10,
    rotation: (Math.random() * (45 + 45) - 45),
  };

  const cls = cn(
    'flex flex-col w-full h-full rounded-md p-[1rem] 2xl:p-[1.5rem] relative cursor-pointer transition transition-shadow duration-300 ease-in-out',
    {
      'bg-white text-black': !isOut,
      'bg-dark text-muted out': isOut,
      'current': isCurrent,
    },
  );

  return <div className={cls}>
    <div className="flex flex-row flex-nowrap leading-[2.75rem] pb-[1rem] 2xl:pb-[2rem]">
      <div className="flex-none mr-4"><Avatar /></div>
      <div className="flex-1 text-h7 2xl:text-h6 truncate">{player.name}</div>
    </div>
    <hr />
    <div className="flex-1 flex flex-wrap pt-[1.5rem] 2xl:pt-[2.75rem] content-around">
      <div className="flex flex-row flex-nowrap items-center basis-1/2 2xl:pb-10">
        <div className="mr-4"><SmileyCorrect /></div>
        <div className="text-h5 font-bold mr-2">{player.rightCount}</div>
        <div className="text-h8 leading-[1.2rem]">правильных ответов</div>
      </div>
      <div className="flex flex-row flex-nowrap items-center basis-1/2 2xl:pb-10">
        <div className="mr-4"><SmileyIncorrect /></div>
        <div className="text-h5 font-bold mr-2">{player.passCount}</div>
        <div className="text-h8 leading-[1.2rem]">неверных ответов</div>
      </div>
      <div className="flex flex-row flex-nowrap items-center basis-1/2 2xl:pb-10">
        <div className="mr-4"><SmileyBank /></div>
        <div className="text-h5 font-bold mr-2">{player.bankSum}</div>
        <div className="text-h8 leading-[1.2rem]">положил в банк</div>
      </div>
    </div>
    {isOut ? <div className="absolute transition duration-500 ease-in" style={{
      zIndex: 10,
      top: position.top + '%',
      left: position.left + '%',
      transform: `scale(3) rotate(${position.rotation}deg)`,
    }}><SmileyIncorrect /></div> : null}
  </div>;
};

export {
  PlayerCard,
};
