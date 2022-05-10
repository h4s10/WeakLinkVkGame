import React from 'react';

import 'effector-logger/inspector';
import './global.css';
import { HUB_URL } from './lib/api';
import { useConnection } from './lib/connection';
import { gameState as gameStateStore } from './lib/store/gameState';
import { role as roleStore, authentication as authenticationStore, authenticate } from './lib/store/auth';
import { GameState, Role } from './lib/constants';
import AuthenticationForm from './components/AuthenticationForm';
import { useStore } from 'effector-react';
import GameSetup from './components/GameSetup';
import SplashScreen from './components/SplashScreen';
import { HubConnectionState } from '@microsoft/signalr';
import { assertNever } from './lib/utils';

export default () => {
  const [connection, connectionState, connectionError] = useConnection(HUB_URL);

  const gameState = useStore(gameStateStore);
  const role = useStore(roleStore);
  const authentication = useStore(authenticationStore);

  if (connectionError) {
    return <SplashScreen caption="Мы самое слабое звено" content={ <div className="text-h4 font-mono">{connectionError.toString()}</div> }/>
  }

  if (connectionState !== HubConnectionState.Connected) {
    return <SplashScreen/>;
  }

  switch (gameState) {
    case GameState.Unauthorized:
      return <AuthenticationForm {...{authentication, authenticate}} />
    case GameState.Unstarted:
      return role === Role.Admin ? <GameSetup/> : <SplashScreen/>;

    // default:
    //   assertNever(gameState);
  }

  return <SplashScreen/>;
}

