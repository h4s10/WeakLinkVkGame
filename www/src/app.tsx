import React, { useEffect } from 'react';

import 'effector-logger/inspector';
import './global.css';
import { useConnection } from './lib/connection';
import { gameState as gameStateStore } from './lib/store/gameState';
import { authenticate, authentication as authenticationStore, role as roleStore } from './lib/store/auth';
import { GameState, Role, RoundState } from './lib/constants';
import AuthenticationForm from './components/AuthenticationForm';
import { useStore } from 'effector-react';
import SplashScreen from './components/SplashScreen';
import Game from './components/Game';
import GameAdmin from './components/GameAdmin';

import { HubConnectionState } from '@microsoft/signalr';
import { availableSessions, createSession, setSession, refreshAvailable as refreshSessions } from './lib/store/session';
import { currentRound, roundState as roundStateStore, roundName as roundNameStore, startRound } from './lib/store/round';
import { ClientTask } from './lib/api';
import { create as createUser, refresh as refreshUsers, users as usersStore } from './lib/store/users';
import { SERVER_HOST, SIGNAL_R_HUB } from './lib/settings';
import Button from './components/Button';
import Page from './components/Page';
import PostRoundAdmin from './components/PostRoundAdmin';

export default () => {
  const [connection, connectionState, connectionError] = useConnection(new URL(SIGNAL_R_HUB, SERVER_HOST).toString());

  const gameState = useStore(gameStateStore);
  const role = useStore(roleStore);
  const authentication = useStore(authenticationStore);
  const sessions = useStore(availableSessions);
  const users = useStore(usersStore);
  const roundName = useStore(roundNameStore);
  const roundState = useStore(roundStateStore);

  useEffect(() => {
    if (!connection) {
      return;
    }
    for (const name of Object.keys(ClientTask)) {
      connection.on(name, (data) => console.log(name, data));
    }
  }, [connection]);

  if (connectionError) {
    return <SplashScreen caption="Мы самое слабое звено" content={<div className="text-h5 2xl:text-h4 font-mono">{connectionError.toString()}</div>} />;
  }

  if (connectionState !== HubConnectionState.Connected) {
    return <SplashScreen />;
  }

  const PostRoundUser = SplashScreen;

  switch (gameState) {
    case GameState.Unauthorized:
      return <AuthenticationForm {...{ authentication, authenticate }} />;
    case GameState.SessionSelect:
      return <GameAdmin
        canCreate={role === Role.Admin}
        sessions={sessions}
        refreshSessions={() => refreshSessions()}
        selectSession={setSession}
        createNewSession={createSession}
        users={users}
        createUser={createUser}
        refreshUsers={refreshUsers}
      />;

    case GameState.ReadyToPlay:
      return role === Role.Admin ? <Page>
        <div className="flex flex-col h-full justify-between">
          <img className="absolute inset-0 -z-10" src="../assets/splashPattern.svg" />
          <div className="text-h4 2xl:text-h3 mb-5">Готовы начинать <p>раунд «{roundName}»?</p></div>
          {/*<div className="flex">*/}
          {/*  <h5 className="text-h5">Время:</h5>*/}
          {/*  <input type="number" className="text-dark" value={2} /> m*/}
          {/*  <input type="number" className="text-dark" value={30} /> s*/}
          {/*</div>*/}
          <Button className="bg-muted text-vk-blue rounded" handler={() => startRound(currentRound.getState())}>Начинаем</Button>
        </div>
      </Page> : <SplashScreen caption={roundName} />
    case GameState.Round:
      switch (roundState) {
        case RoundState.Playing:
          return <Game/>;
        case RoundState.Ended:
          return role === Role.Admin ? <PostRoundAdmin/> : <PostRoundUser/>
      }
      return;
    default:
      return <SplashScreen />;
  }
}

