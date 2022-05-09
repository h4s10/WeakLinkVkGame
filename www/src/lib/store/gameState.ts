import { createEvent, createStore } from 'effector-logger';
import { Authentication, GameState } from '../constants';
import { authentication } from './auth';

export const gameState = createStore<GameState>(GameState.Unauthorized, { name: 'Game state' });
export const nextState = createEvent<GameState>('Game state advance');

gameState.on(nextState, (oldState, newState) => newState);

gameState.on(authentication, (state, authentication) => {
  if (authentication === Authentication.None) {
    return GameState.Unauthorized;
  }

  if (authentication === Authentication.Authenticated && state === GameState.Unauthorized) {
    return GameState.Unstarted;
  }

  return state;
});

(window as any).debug = {
  ...(window as any).debug ?? {},
  forceStateUnauthorized() { nextState(GameState.Unauthorized) },
  forceStateUnstarted() { nextState(GameState.Unstarted) },
  forceStateRound() { nextState(GameState.Round) },
  forceStateRoundEnded() { nextState(GameState.RoundEnded) },
}
