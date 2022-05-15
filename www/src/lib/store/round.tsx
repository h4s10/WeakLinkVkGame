import { RoundState } from '../constants';
import { createEffect, createStore, Effect } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { Round, ServerTask, Session, User } from '../api';
import { session, refreshState } from './session';
import {
  sessionUpdate as sessionUpdateEvent,
  question as questionEvent,
} from './serverEvents';
import { bank, bankFull, currentPlayer, players, question, timeIsUp } from './game';

export const roundState = createStore<RoundState>(RoundState.Unstarted, { name: 'Round state' });

export const rounds = createStore<Round['id'][]>([], { name: 'Round ids' });
export const currentRound = createStore<Round['id']>(null, { name: 'Current round id' });

export const createRound: Effect<Session['id'] | void, void> = createEffect('Create round');
export const startRound: Effect<Round['id'], void> = createEffect('Start round');
export const endRound: Effect<{ roundId: Round['id'], weakUserId: User['id'] }, void> = createEffect('End round');

export const nextRound: Effect<{ roundId: Round['id'], weakUserId: User['id'] }, void> = createEffect('Next round');

export const roundEndReason = createStore<'time' | 'bank' >(null);

export const refresh: Effect<Session['id'] | void, void> = createEffect('Refresh round');

export const roundName = createStore<string>('Раунд 1', { name: 'Round name' });

createRound.use((sessionId: number = session.getState()) => getConnectionInstance().invoke(ServerTask.CreateRound, sessionId));
startRound.use((id: number = currentRound.getState()) => getConnectionInstance().invoke(ServerTask.StartRound, id))
endRound.use(({ roundId, weakUserId }) => getConnectionInstance().invoke(ServerTask.EndRound, roundId, weakUserId))

endRound.finally.watch(() => refresh());
endRound.finally.watch(() => refreshState());

players.reset(endRound.done);
currentPlayer.reset(endRound.done);
bank.reset(endRound.done);
question.reset(endRound.done);

refresh.use((sessionId = session.getState()) => getConnectionInstance().invoke(ServerTask.GetRoundState, sessionId));

roundState.on(createRound.done, () => RoundState.Playing);
roundState.on(startRound.done, () => RoundState.Playing);
roundState.on(endRound.done, () => RoundState.Unstarted);

currentRound.watch((currentRound) => currentRound !== null && refresh(session.getState()));

rounds.on(sessionUpdateEvent, (prev, { rounds }) => rounds);
currentRound.on(sessionUpdateEvent, (prev, { current }) => current ?? null);
roundName.on(sessionUpdateEvent, (prev, { rounds, current }) => `Раунд ${Math.max(rounds.indexOf(current), 0) + 1}`);

roundState.on(questionEvent, () => RoundState.Playing);

roundState.on(timeIsUp, () => RoundState.Ended);
roundState.on(bankFull, () => RoundState.Ended);
roundEndReason.on(timeIsUp, () => 'time');
roundEndReason.on(bankFull, () => 'bank');
roundEndReason.on(roundState, (oldReason, newState) => newState === RoundState.Ended ? undefined : null);

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
