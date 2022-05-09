import React, { useEffect, useState } from 'react';

import './global.css';
import { HUB_URL } from './lib/api';
import { useConnection, setConnection } from './lib/connection';
import { gameState as gameStateStore } from './lib/store/gameState';
import { role as roleStore, authentication as authenticationStore, authenticate } from './lib/store/auth';
import { GameState, Role } from './lib/constants';
import AuthenticationForm from './components/AuthenticationForm';
import { useStore } from 'effector-react';
import GameSetup from './components/GameSetup';
import SplashScreen from './components/SplashScreen';

export default () => {
  const connection = useConnection(HUB_URL);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  const gameState = useStore(gameStateStore);
  const role = useStore(roleStore);
  const authentication = useStore(authenticationStore);

  useEffect(() => {
    if (connection) {
      setConnection(connection);
      connection.start().catch(setConnectionError);
    }
  }, [connection]);

  if (!connection) {
    return <SplashScreen/>;
  }

  // if (connectionError) {
  //   return <SplashScreen caption="ошибка" content={ <div style={{ fontFamily: 'monospace' }}>{connectionError.toString()}</div> }/>
  // }
  //
  // if (connection.state !== HubConnectionState.Connected) {
  //   return <SplashScreen content={ <h2>{connection.state}</h2> }/>;
  // }

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

