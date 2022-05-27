import React, { useEffect, useState } from 'react';

import type { FunctionComponent } from 'react';
import { GameState, Role } from '../lib/constants';
import Button from './Button';
import { nextState } from '../lib/store/gameState';
import { useStore } from 'effector-react';
import { role as roleStore } from '../lib/store/auth';
import { refreshState as refreshSession } from '../lib/store/session';
import { allRounds as allRoundsStore, refresh as refreshRound } from '../lib/store/round';
import { players as playersStore } from '../lib/store/game';
import { Round, UserRound } from '../lib/api';
import SplashScreen from './SplashScreen';

const GameOver: FunctionComponent = () => {
  const role = useStore(roleStore);
  const roundPlayers = useStore(playersStore);
  const allRounds = useStore(allRoundsStore);

  const [cumulativeScore, setCumulativeScore] = useState(0);

  useEffect(() => {
    void refreshSession();

    for (const id of Object.keys(allRounds)) {
      void refreshRound(parseInt(id, 10));
    }
  }, [refreshSession, refreshRound]);

  useEffect(() => {
    const score = (Object.values(allRounds) as (Round | null)[]).filter(Boolean).reduce(
      (gameSum, { users }) => gameSum + users.reduce(
        (roundSum, { bankSum }) => roundSum + bankSum,
        0),
      0);

    setCumulativeScore(score);
  }, [allRounds]);

  const getUserTotalScore = (userId: UserRound['id']) => {
    if (cumulativeScore === 0) {
      return 0;
    }

    return (Object.values(allRounds) as (Round | null)[]).filter(Boolean).reduce(
      (gameSum, { users }) => gameSum + users.find(({ id }) => id === userId)?.bankSum ?? 0,
      0
    );
  }

  return <SplashScreen caption='Игра закончена!'>
    <h1 className="text-9xl">{ cumulativeScore }</h1>
    <ul className="list-decimal mt-10 w-auto">
      { roundPlayers
        .filter( ({ isWeak }) => !isWeak )
        .map(player => ({ player, score: getUserTotalScore(player.id) }))
        .sort((a, b) => b.score - a.score)
        .map(({ player, score }, i) =>
          <li key={player.id} className="text-h7 2xl:text-h4 font-thin flex place-content-between mx-2">
            <span><span className="text-muted inline-block min-w-[2rem]">{i + 1}.</span>{player.name}</span> <span>{score}</span>
          </li>
        )
      }
    </ul>

    { role === Role.Admin &&
      <Button focused className="bg-muted text-vk-blue rounded mt-20" handler={() => nextState(GameState.SessionSelect)}>Завершить</Button>
    }
  </SplashScreen>
}

export default GameOver;
