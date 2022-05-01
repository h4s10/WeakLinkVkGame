import React, { useEffect, useState } from 'react';

import { HUB_URL } from '../lib/api';
import { useConnection, setConnection } from '../lib/connection';
import { gameState as gameStateStore } from '../lib/store/gameState';
import { role as roleStore } from '../lib/store/auth';
import { GameState, Role } from '../lib/constants';
import AuthenticationForm from './AuthenticationForm';
import { useStore } from 'effector-react';
import { HubConnectionState } from '@microsoft/signalr';
import GameSetup from './GameSetup';
import SplashScreen from './SplashScreen';

export default () => {
  const connection = useConnection(HUB_URL);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  const gameState = useStore(gameStateStore);
  const role = useStore(roleStore);

  useEffect(() => {
    if (connection) {
      setConnection(connection);
      connection.start().catch(setConnectionError);
    }
  }, [connection]);

  if (!connection) {
    return null;
  }

  if (connectionError) {
    return <pre>{connectionError.toString()}</pre>;
  }

  if (connection.state !== HubConnectionState.Connected) {
    return <h2>{connection.state}</h2>
  }

  switch (gameState) {
    case GameState.Unauthorized:
      return <AuthenticationForm/>
    case GameState.Unstarted:
      return role === Role.Admin ? <GameSetup/> : <SplashScreen/>;

    // default:
    //   assertNever(gameState);
  }

  return <>
    <h1>Вы самое слабое звено!</h1>
  </>;
}

