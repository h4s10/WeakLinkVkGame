import React, { FC } from 'react';
import { PlayerCard } from '../PlayerCard';
import { User, UserRound } from '../../lib/api';

interface Props {
  players: UserRound[],
  currentPlayer?: User['id'],
  weakPlayer?: User['id'],
  onPlayerClick: (player: User['id']) => void;
}

const PlayersGrid: FC<Props> = ({ players = [], currentPlayer, weakPlayer, onPlayerClick }) => {
  return <div className="grid grid-cols-3 gap-6 w-full h-full">
    {players.map((player) =>
      <div key={player.id} className="basis-1/4" onClick={() => !player.isWeak && onPlayerClick(player.id)}>
        <PlayerCard player={player} isCurrent={currentPlayer === player.id} isOut={weakPlayer === player.id || player.isWeak} />
      </div>)}
  </div>;
};

export {
  PlayersGrid,
};
