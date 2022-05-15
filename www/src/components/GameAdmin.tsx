import React, { useCallback, useState } from 'react';
import type { FunctionComponent } from 'react';

import { Session, User } from '../lib/api';
import { pad2 } from '../utils/string';

import Page from './Page';
import Button from './Button';
import Input from './Input';
import List from './List';
import { Tabs } from './Tabs/Tabs';
import { TabButton } from './Tabs/TabButton';

import ChevronLeft from '../../assets/chevronLeftOutline.svg';

interface Props {
  canCreate: boolean,
  sessions: Session[],
  refreshSessions: () => Promise<any>,
  selectSession: (id: Session['id']) => void,
  createNewSession: (data: { name: string, users: User['id'][] }) => void,
  users: User[],
  createUser: (name: string) => Promise<void>,
  refreshUsers: () => Promise<any>,
}

const MAX_USERS_PER_SESSION = 6;

enum Screen {
  Sessions = 'sessions',
  Users = 'users',
  UserSelect = 'user-select'
}

const getTitle = (state: Screen) => {
  switch (state) {
    case Screen.Users:
      return 'Игроки';
    case Screen.Sessions:
      return '01 Выбор игры';
    case Screen.UserSelect:
      return '02 Выбор игроков';
  }
}

const GameAdmin: FunctionComponent<Props> = (
  {
    canCreate,
    sessions,
    refreshSessions,
    selectSession,
    createNewSession,
    users,
    createUser,
    refreshUsers,
  },
) => {
  const [adminScreen, setAdminScreen] = useState<Screen>(Screen.Sessions);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionUsers, setNewSessionUsers] = useState<User[]>([]);

  const startSessionCreation = useCallback((name) => {
    setAdminScreen(Screen.UserSelect);
    setNewSessionName(name);
  }, []);

  const abortSessionCreation = useCallback(() => {
    setAdminScreen(Screen.Sessions);
    setNewSessionName('');
    setNewSessionUsers([]);
  }, []);

  const createSession = useCallback(() => {
    if (!newSessionName || !newSessionUsers.length) {
      return;
    }
    createNewSession({ name: newSessionName, users: newSessionUsers.map(({ id }) => id) });
  }, [createNewSession, newSessionName, newSessionUsers]);

  const addUserToNewSession = useCallback((user: User) => {
    if (
      newSessionUsers.length >= MAX_USERS_PER_SESSION ||
      newSessionUsers.find(existing => user.id === existing.id)
    ) {
      return;
    }

    setNewSessionUsers([...newSessionUsers, user]);
  }, [newSessionUsers]);

  const removeUserFromNewSession = useCallback((user: User) => {
    setNewSessionUsers(newSessionUsers.filter(existing => existing.id !== user.id));
  }, [newSessionUsers]);

  const moveUserLeft = useCallback((user: User) => {
    const index = newSessionUsers.findIndex(existing => existing.id === user.id);
    if (index === -1 || index === 0) {
      return;
    }

    const swap = newSessionUsers[index - 1];
    const clone = [...newSessionUsers];
    clone[index - 1] = user;
    clone[index] = swap;

    setNewSessionUsers(clone);
  }, [newSessionUsers]);

  const moveUserRight = useCallback((user: User) => {
    const index = newSessionUsers.findIndex(existing => existing.id === user.id);
    if (index === -1 || index === newSessionUsers.length - 1) {
      return;
    }

    const swap = newSessionUsers[index + 1];
    const clone = [...newSessionUsers];
    clone[index + 1] = user;
    clone[index] = swap;

    setNewSessionUsers(clone);
  }, [newSessionUsers]);

  return <Page>
    <div className="flex gap-5 justify-between items-center">
      <div className="text-h4 mb-2 flex gap-6 items-center"><a href="/" className="cursor-pointer"><ChevronLeft /></a> {getTitle(adminScreen)}</div>
      {
        canCreate && ['sessions', 'sessionUsers', 'users'].includes(adminScreen) && <Tabs>
          <>
            <TabButton active={adminScreen === 'sessions'} handler={() => setAdminScreen(Screen.Sessions)}>Игры</TabButton>
            <TabButton active={adminScreen === 'users'} handler={() => setAdminScreen(Screen.Users)}>Игроки</TabButton>
          </>
        </Tabs>
      }
    </div>
    <div className="w-full h-max my-auto p-10 min-h-[50%]">
      {/* Создание игры */}
      {(!canCreate || adminScreen === 'sessions') && <>
        {
          canCreate && <div className="p-8 bg-white/40 rounded-md shadow border border-white/70 mb-5">
            <h6 className="text-h6">Новая игра</h6>
            <Input buttonText="Создать" submit={startSessionCreation} />
          </div>
        }
        <List<Session>
          header="Игры в процессе"
          items={sessions}
          refresh={refreshSessions}
          select={({ id }) => selectSession(id)}
          itemKey={({ id }) => id}
          serialize={({ name }) => name}
          emptyList={!canCreate && !sessions.length && <div className="flex gap-5 flex-col items-center text-center content-center">
            <h4 className="text-h4">Нет доступных игр.</h4>
            <h4 className="text-h6">Дождитесь когда Ведущий создаст игру.</h4>
          </div>}
        />
      </>}

      {/* Наполнение игры */}
      {canCreate && adminScreen === Screen.UserSelect && <>
        <div className="flex gap-5 mb-5">
          <h6 className="text-h6 mb-5">Игроки «{newSessionName}»</h6>
          <div className="ml-auto" />
          <Button className="hover:border-incorrect hover:text-incorrect border-none max-w-max px-10 rounded" handler={abortSessionCreation}>Отмена</Button>
          <Button className="bg-vk-blue max-w-max px-10 rounded" handler={createSession}>Создать игру</Button>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-5">
          {newSessionUsers.map((user, idx) => <div key={user.id} className="flex flex-col rounded-md border-2 text-dark shadow justify-between p-8 bg-white/40 border border-white/60 overflow-hidden">
            <div className="text-h6 2xl:text-h5 text-center relative text-white">
              <div className="absolute left-0 top-0 text-h3 text-white/60 -z-10 -translate-x-[40%] -translate-y-[50%]">{pad2(idx+1)}</div>
              {user.name}
            </div>
            <div className="flex items pt-8">
              <button className="w-1/3 h-16 text-3xl leading-5 shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all" onClick={() => moveUserLeft(user)}>◀</button>
              <button className="w-1/3 h-16 text-3xl leading-5 shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all" onClick={() => removeUserFromNewSession(user)}>✕</button>
              <button className="w-1/3 h-16 text-3xl leading-5 shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all" onClick={() => moveUserRight(user)}>▶</button>
            </div>
          </div>)}
        </div>

        <List<User>
          header="Все игроки"
          items={users}
          refresh={refreshUsers}
          select={addUserToNewSession}
          itemKey={({ id }) => id}
          serialize={({ name }) => name}
        />
      </>}

      {/* Редактирование игроков */}
      {canCreate && adminScreen === 'users' && <>
        <div className="p-8 rounded-md shadow bg-white/40 border border-white mb-5">
          <h6 className="text-h6">Добавить игрока</h6>
          <Input buttonText="Добавить" submit={createUser} />
        </div>
        <List<User>
          header="Зарегистрированные игроки"
          items={users}
          refresh={refreshUsers}
          select={() => {}}
          itemKey={({ id }) => id}
          serialize={({ name }) => name}
        />
      </>}
    </div>
  </Page>;
};

export default GameAdmin;

