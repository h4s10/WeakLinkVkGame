import React from 'react';

import 'effector-logger/inspector';
import './global.css';
import { useConnection } from './lib/connection';
import { gameState as gameStateStore } from './lib/store/gameState';
import { authenticate, authentication as authenticationStore, role as roleStore } from './lib/store/auth';
import { GameState, Role } from './lib/constants';
import AuthenticationForm from './components/AuthenticationForm';
import { useStore } from 'effector-react';
import SplashScreen from './components/SplashScreen';
import Game from './components/Game';
import { PlayerCard } from './components/PlayerCard';
import { RoundState } from './components/RoundState';
import GameAdmin from './components/GameAdmin';

import { HubConnectionState } from '@microsoft/signalr';
import { availableSessions, createSession, joinSession, refreshAvailable as refreshSessions } from './lib/store/session';
import { ClientTask, SERVER_HOST, SIGNAL_R_HUB } from './lib/api';
import { create as createUser, refresh as refreshUsers, users as usersStore } from './lib/store/users';

export default () => {
  const [connection, connectionState, connectionError] = useConnection(new URL(SIGNAL_R_HUB, SERVER_HOST).toString());

  const gameState = useStore(gameStateStore);
  const role = useStore(roleStore);
  const authentication = useStore(authenticationStore);
  const sessions = useStore(availableSessions);
  const users = useStore(usersStore);

  if (connectionError) {
    return <SplashScreen caption="Мы самое слабое звено" content={<div className="text-h4 font-mono">{connectionError.toString()}</div>} />;
  }

  if (connectionState !== HubConnectionState.Connected) {
    return <SplashScreen />;
  }

  for (const name of Object.keys(ClientTask)) {
    connection.on(name, (data) => console.log(name, data));
  }

  switch (gameState) {
    case GameState.Unauthorized:
      return <AuthenticationForm {...{ authentication, authenticate }} />;
    case GameState.SessionSelect:
      return <GameAdmin
        canCreate={role === Role.Admin}
        sessions={sessions}
        refreshSessions={ () => refreshSessions()}
        selectSession={joinSession}
        createNewSession={ createSession }
        users={ users }
        createUser={ createUser }
        refreshUsers={ refreshUsers }
      />;
    case GameState.Round:
      function List() {
        return <div className="grid grid-cols-3 gap-6 w-full h-full">
          <div className="basis-1/4"><PlayerCard player={{ name: 'Лиза Кудроу' } as any} playerStatus={{} as any} /></div>
          <div className="basis-1/4"><PlayerCard player={{ name: 'Лиза Кудроу' } as any} playerStatus={{} as any} isOut={true} /></div>
          <div className="basis-1/4"><PlayerCard player={{ name: 'Лиза Кудроу' } as any} playerStatus={{} as any} /></div>
          <div className="basis-1/4"><PlayerCard player={{ name: 'Лиза Кудроу' } as any} playerStatus={{} as any} isCurrent={true} /></div>
          <div className="basis-1/4"><PlayerCard player={{ name: 'Лиза Кудроу' } as any} playerStatus={{} as any} /></div>
        </div>;
      }

      return <Game score={() => <>Score</>} main={() => List()} footer={() => <RoundState round={{} as any} />} />;
    default:
      return <SplashScreen />;
  }
}

