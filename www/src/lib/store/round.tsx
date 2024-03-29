import { RoundState } from '../constants';
import { createEffect, createStore, Effect } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { Round, Round as ServerRoundState, ServerTask, Session, User } from '../api';
import { refreshState, session } from './session';
import { question as questionEvent, roundUpdate, sessionUpdate as sessionUpdateEvent } from './serverEvents';
import { bank, bankFull, questionsEnded, currentPlayer, players, question, timeIsUp } from './game';
import { endsAt as timerEndsAt, active as timerActive, start as startTimer } from './timer';

export const roundState = createStore<RoundState>(RoundState.Unstarted, { name: 'Round state' });

export const currentRound = createStore<Round['roundId']>(null, { name: 'Current round id' });

export const createRound: Effect<Session['id'] | void, void> = createEffect('Create round');
export const startRound: Effect<Round['roundId'], void> = createEffect('Start round');
export const endRound: Effect<{ roundId: Round['roundId'], weakUserId: User['id'] }, void> = createEffect('End round');

export const nextRound: Effect<{ roundId: Round['roundId'], weakUserId: User['id'] }, void> = createEffect('Next round');

export const roundEndReason = createStore<'time' | 'bank' | 'noMoreQuestions' >(null, { name: 'Round end reason' });

export const refresh: Effect<Round['roundId'] | void, void> = createEffect('Refresh round');

export const roundName = createStore<string>('Раунд 1', { name: 'Round name' });

export const allRounds = createStore<Record<Round['roundId'], ServerRoundState | null>>({}, {
  name: 'All past rounds',
  updateFilter: (prev, next) => JSON.stringify(prev) !== JSON.stringify(next),
});

createRound.use((sessionId: number = session.getState()) => getConnectionInstance().invoke(ServerTask.CreateRound, sessionId));
startRound.use((id: number = currentRound.getState()) => getConnectionInstance().invoke(ServerTask.StartRound, id))
endRound.use(({ roundId, weakUserId }) => getConnectionInstance().invoke(ServerTask.EndRound, roundId, weakUserId))

endRound.finally.watch(() => refresh());
endRound.finally.watch(() => refreshState());

players.reset(endRound.done);
currentPlayer.reset(endRound.done);
bank.reset(endRound.done);
question.reset(endRound.done);
timerEndsAt.reset(endRound.done);
timerActive.reset(endRound.done);

refresh.use((roundId = currentRound.getState()) => getConnectionInstance().invoke(ServerTask.GetRoundState, roundId));

roundState.on(createRound.done, () => RoundState.Playing);
roundState.on(startRound.done, () => RoundState.Playing);
roundState.on(endRound.done, () => RoundState.Unstarted);

currentRound.watch((currentRound) => currentRound !== null && refresh());

currentRound.on(sessionUpdateEvent, (prev, { current }) => current ?? null);
roundName.on(sessionUpdateEvent, (prev, { rounds }) => `Раунд ${rounds.length}`);

roundState.on(questionEvent, () => RoundState.Playing);

roundState.on(timeIsUp, (currentState) => currentState === RoundState.Playing ? RoundState.Ended : undefined);
roundState.on(bankFull, (currentState) => currentState === RoundState.Playing ? RoundState.Ended : undefined);
roundState.on(questionsEnded, (currentState) => currentState === RoundState.Playing ? RoundState.Ended : undefined);
roundEndReason.on(timeIsUp, () => 'time');
roundEndReason.on(bankFull, () => 'bank');
roundEndReason.on(questionsEnded, () => 'noMoreQuestions');
roundEndReason.on(roundState, (oldReason, newState) => newState === RoundState.Ended ? undefined : null);

allRounds.on(sessionUpdateEvent, (prevRoundsData, { rounds }) => {
  const next = {
    ...Object.fromEntries(rounds.map(k => [k.id, null])),
    ...prevRoundsData
  }

  for (const round of rounds) {
    if (next[round.id] !== null) {
      next[round.id].roundState = round.state;
    }
  }

  return next;
});

allRounds.on(roundUpdate, (pastRounds, roundUpdate) => ({
  ...pastRounds,
  [roundUpdate.roundId]: roundUpdate,
}));

roundState.watch(state => {
  if (state === RoundState.Playing) {
    startTimer();
  }
});

nextRound.use(async (endRoundParams) => {
  await endRound(endRoundParams);
  await createRound();
});

(window as any).debug = {
  ...(window as any).debug ?? {},
  refreshRoundState: refresh,
  createRound,
  startRound,
  endRound,
}
