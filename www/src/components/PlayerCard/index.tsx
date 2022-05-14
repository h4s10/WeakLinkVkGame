import React, { FC, useMemo, useRef } from 'react';
import cn from 'classnames';

import { Player, PlayerGameStatus, PlayerReputation } from '../../lib/types';
import Avatar from '../../../assets/avatar.svg';
import SmileyCorrect from '../../../assets/smileyCorrect.svg';
import SmileyIncorrect from '../../../assets/smileyIncorrect.svg';
import SmileyBank from '../../../assets/smileyBank.svg';

import './player.css';

interface Props {
  player: Player;
  playerStatus: PlayerGameStatus;
  isCurrent?: boolean;
  isOut?: boolean;
}

const PlayerCard: FC<Props> = ({ player, playerStatus, isCurrent = false, isOut = false }) => {
  const ref = useRef(null);

  const renderOut = useMemo(() => {
    if (!isOut || !ref.current) {
      return;
    }
    const bcr = ref.current.getBoundingClientRect();

    const position = {
      top: Math.random() * (bcr.height - 100 - 100) + 100,
      left: Math.random() * (bcr.width - 100 - 100) + 100,
      rotation: (Math.random() * (45 + 45) - 45),
    };

    return <div className="absolute transition duration-500 ease-in" style={{
      zIndex: 1000,
      top: position.top + 'px',
      left: position.left + 'px',
      transform: `scale(3) rotate(${position.rotation}deg)`,
    }}><SmileyIncorrect /></div>;
  }, [ref.current]);

  const cls = cn(
    'flex flex-col w-full h-full rounded-md p-[1rem] 2xl:p-[1.5rem] relative',
    {
      'bg-white text-black': !isOut,
      'bg-dark text-muted out': isOut,
      'current': isCurrent,
    },
  );

  const { statuses = {} } = playerStatus;

  return <div className={cls} ref={ref}>
    <div className="flex flex-row flex-nowrap leading-[2.75rem] pb-[1rem] 2xl:pb-[2rem]">
      <div className="flex-none mr-4"><Avatar /></div>
      <div className="flex-1 text-h7 2xl:text-h6 truncate">{player.name}</div>
    </div>
    <hr />
    <div className="flex-1 flex flex-wrap pt-[1.5rem] 2xl:pt-[2.75rem] content-around">
      <div className="flex flex-row flex-nowrap basis-1/2">
        <div className="mr-4"><SmileyCorrect /></div>
        <div className="text-h5 font-bold mr-2">{statuses[PlayerReputation.Wasserman] || '-'}</div>
        <div className="text-h8 pt-2 leading-[1.2rem]">правильных ответов</div>
      </div>
      <div className="flex flex-row flex-nowrap basis-1/2">
        <div className="mr-4"><SmileyIncorrect /></div>
        <div className="text-h5 font-bold mr-2">{statuses[PlayerReputation.Blondy] || '-'}</div>
        <div className="text-h8 pt-2 leading-[1.2rem]">неверных ответов</div>
      </div>
      <div className="flex flex-row flex-nowrap basis-1/2">
        <div className="mr-4"><SmileyBank /></div>
        <div className="text-h5 font-bold mr-2">{statuses[PlayerReputation.BankSaver] || '-'}</div>
        <div className="text-h8 pt-2 leading-[1.2rem]">положил в банк</div>
      </div>
    </div>
    {renderOut}
  </div>;
};

export {
  PlayerCard,
};
