import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import Page from '../Page';

import './game.css';
import { useStore } from 'effector-react';
import { role as roleStore } from '../../lib/store/auth';
import { currentRound as currentRoundStore, roundName as roundNameStore, roundState as roundStateStore } from '../../lib/store/round';
import { answerQuestion, bank as bankStore, players as playersStore, question as questionStore, saveBank, stake as stakeStore } from '../../lib/store/game';
import { QuestionVerdict, RoundState } from '../../lib/constants';
import { RoundInfo } from '../RoundInfo';
import { QuestionCard } from '../QuestionCard';
import { Score } from '../Score';
import { active, endsAt } from '../../lib/store/timer';

const Game: FunctionComponent = () => {
  const currentRound = useStore(currentRoundStore);
  const role = useStore(roleStore);
  const roundState = useStore(roundStateStore);
  const roundName = useStore(roundNameStore);
  const bank = useStore(bankStore);
  const stake = useStore(stakeStore);
  const question = useStore(questionStore);
  const players = useStore(playersStore);
  const timerEndsAt = useStore(endsAt);
  const timerActive = useStore(active);

  const player = players.find(({ id }) => id === question.currentUserId);

  const onVerdict = useCallback((verdict: QuestionVerdict) => {
    if (verdict === QuestionVerdict.bank) {
      void saveBank({
        questionId: question.id,
        sum: stake,
        userId: player.id,
        roundId: currentRound,
      });
    } else {
      void answerQuestion({
        isCorrect: verdict === QuestionVerdict.correct,
        questionId: question.id,
        userId: player.id,
        roundId: currentRound,
      })
    }
  }, [question, stake, player, currentRound]);

  return <Page>
    <div className="Game grid grid-rows-5 grid-cols-7 content-between gap-2 h-full relative">
      <div className="row-span-4 col-span-1 relative">
        <Score value={stake}/>
      </div>
      <div className="row-span-4 col-span-6 relative">
        <QuestionCard
          player={player}
          question={question}
          role={role}
          onVerdict={onVerdict}
          onClose={console.log}
        />
      </div>
      <div className="row-span-1 col-span-7 grid-flow-row mt-12 relative">
        <RoundInfo
          running={roundState === RoundState.Playing && timerActive}
          name={roundName}
          bank={bank}
          endsAt={timerEndsAt}/>
      </div>
    </div>
  </Page>;
};

export default Game;

