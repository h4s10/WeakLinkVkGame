import { RoundState } from '../constants';
import { createEffect, createEvent, createStore } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { ServerTask } from '../api';

export const roundState = createStore<RoundState>(RoundState.Unstarted, { name: 'Round state' });
export const startRound = createEffect('Start round');
export const endRound = createEvent('End round');
export const createRound = createEffect('Create round');

export const roundName = createStore<string>('Round name');
export const setRoundName = createEvent<string>('set round name');

createRound.use((sessionId: number) => getConnectionInstance().invoke(ServerTask.CreateRound, sessionId));
startRound.use((id: number) => getConnectionInstance().invoke(ServerTask.StartRound, id))

roundState.on(startRound.done, () => RoundState.Playing);
roundState.on(endRound, () => RoundState.Ended);

roundName.on(setRoundName, (prev, next) => next);
