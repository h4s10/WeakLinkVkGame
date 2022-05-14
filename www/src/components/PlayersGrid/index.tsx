import React, { FC } from 'react';
import { Player, PlayerGameStatus } from '../../lib/types';
import { PlayerCard } from '../PlayerCard';

interface Props {
  players: {
    player: Player,
    status: PlayerGameStatus,
    isOut?: boolean,
  }[],
  currentPlayer?: Player,
  onPlayerClick: (player: Player) => void;
}

const PlayersGrid: FC<Props> = ({ players = [], currentPlayer, onPlayerClick }) => {
  return <div className="grid grid-cols-3 gap-6 w-full h-full">
    {players.map(({ player, status, isOut }, idx) =>
      <div key={player.id || idx} className="basis-1/4" onClick={() => !isOut && onPlayerClick(player)}>
        <PlayerCard player={player} playerStatus={status} isCurrent={currentPlayer === player} isOut={isOut} />
      </div>)}
  </div>;
};

export {
  PlayersGrid,
};
