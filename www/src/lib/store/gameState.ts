import { createEvent, createStore } from 'effector-logger';
import { Authentication, GameState, RoundState } from '../constants';
import { authentication } from './auth';
import { session } from './session';
import { roundState } from './round';
import { players } from './game';
import { WINNERS_PER_SESSION } from '../settings';

export const gameState = createStore<GameState>(GameState.Unauthorized, { name: 'Game state' });
export const nextState = createEvent<GameState>('Game state advance');

gameState.on(nextState, (oldState, newState) => newState);

gameState.on(authentication, (state, authentication) => {
  if (authentication === Authentication.None) {
    return GameState.Unauthorized;
  }

  if (state === GameState.Unauthorized && authentication === Authentication.Authenticated) {
    return GameState.SessionSelect;
  }

  return undefined;
});

gameState.on(session, (state, joinedSession) => {
  if (state === GameState.SessionSelect && joinedSession !== undefined) {
    return GameState.ReadyToPlay;
  }

  return undefined;
});

gameState.on(roundState, (state, newRoundState) => {
  if (state === GameState.ReadyToPlay && newRoundState !== RoundState.Unstarted) {
    return GameState.Round;
  }
});

gameState.on(players, (state, players) => {
  if ((state === GameState.Round || state === GameState.ReadyToPlay) &&
    players.length > 0 &&
    players.filter( ({ isWeak }) => !isWeak ).length <= WINNERS_PER_SESSION
  ) {
    return GameState.Ended;
  }
});

(window as any).debug = {
  ...(window as any).debug ?? {},
  forceStateUnauthorized() { nextState(GameState.Unauthorized) },
  forceStateSessionSelect() { nextState(GameState.SessionSelect) },
  forceStateRound() { nextState(GameState.Round) },
}
