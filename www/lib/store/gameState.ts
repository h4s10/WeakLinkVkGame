import { createEvent, createStore } from 'effector';
import { Authentication, GameState } from '../constants';
import { authentication } from './auth';

export const gameState = createStore<GameState>(GameState.Unauthorized);
export const nextState = createEvent();

gameState.on(nextState, (newState) => newState);

gameState.on(authentication, (state, authentication) => {
  console.log('gamestate recieved authentication', {state, authentication});

  if (authentication === Authentication.None) {
    return GameState.Unauthorized;
  }

  if (authentication === Authentication.Authenticated && state === GameState.Unauthorized) {
    return GameState.Unstarted;
  }

  return state;
});


gameState.watch(v => console.log('gameState:', v));
