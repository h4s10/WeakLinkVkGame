import React, { FC } from 'react';
import { Player, PlayerGameStatus } from '../../lib/types';
import { PlayerCard } from '../PlayerCard';

interface Props {
  players: {
    player: Player,
    status: PlayerGameStatus,
    isCurrent?: boolean,
    isOut?: boolean,
  }[];
}

const PlayersGrid: FC<Props> = ({ players = [] }) => {
  return <div className="grid grid-cols-3 gap-6 w-full h-full">
    {players.map(({ player, status, isCurrent, isOut }) =>
      <div className="basis-1/4"><PlayerCard key={player.id} player={player} playerStatus={status} isCurrent={isCurrent} isOut={isOut} /></div>)}
  </div>;
};

export {
  PlayersGrid,
};
