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

import { ReactComponent as ChevronLeft } from '../../assets/chevronLeftOutline.svg';
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg';
import { ReactComponent as ArrowUpOutlineIcon } from '../../assets/arrowUpOutline.svg';
import { ReactComponent as ArrowDownOutlineIcon } from '../../assets/arrowDownOutline.svg';
import { USERS_PER_SESSION } from '../lib/settings';

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
};

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
    const userIdx = newSessionUsers.findIndex(existing => user.id === existing.id);

    if (userIdx !== -1) {
      newSessionUsers.splice(userIdx, 1);
      setNewSessionUsers([...newSessionUsers]);
      return;
    }

    if (newSessionUsers.length >= USERS_PER_SESSION) {
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
      <div className="text-h5 mb-2 flex gap-6 items-center"><a href="/" className="cursor-pointer"><ChevronLeft /></a> {getTitle(adminScreen)}</div>
      {
        canCreate && ['sessions', 'sessionUsers', 'users'].includes(adminScreen) && <Tabs>
          <>
            <TabButton active={adminScreen === 'sessions'} handler={() => setAdminScreen(Screen.Sessions)}>Игры</TabButton>
            <TabButton active={adminScreen === 'users'} handler={() => setAdminScreen(Screen.Users)}>Игроки</TabButton>
          </>
        </Tabs>
      }
    </div>
    {/* Создание игры */}
    {(!canCreate || adminScreen === 'sessions') && <div className="w-full h-max my-auto min-h-[50%] flex flex-col">
      <div className="w-full">
        {
          canCreate && <div className="p-4 bg-white/40 rounded-md shadow border border-white/70 mb-5">
            <h6 className="text-h7">Новая игра</h6>
            <Input buttonText="Создать" submit={startSessionCreation} />
          </div>
        }
      </div>
      <div className="w-full">
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
      </div>
    </div>}

    {/* Наполнение игры */}
    {canCreate && adminScreen === Screen.UserSelect && <>
      <div className="flex gap-5 mb-5">
        <h6 className="text-h6 mb-5">Игроки «{newSessionName}»</h6>
        <div className="ml-auto" />
        <Button className="hover:border-incorrect hover:text-incorrect border-none max-w-max px-10 rounded" handler={abortSessionCreation}>Отмена</Button>
        <Button className="bg-vk-blue max-w-max px-10 rounded" handler={createSession}>Создать игру</Button>
      </div>

      <div className="w-full h-max my-auto min-h-[50%] flex flex-row gap-5">
        <div className="basis-1/2 flex flex-col flex-wrap content-start items-start gap-4 mb-5">
          {newSessionUsers.map((user, idx) => <div key={user.id}
                                                   className="flex flex-col w-full rounded-md border-1 text-dark shadow justify-between p-4 bg-white/30 border border-white/60 overflow-hidden">
            <div className="text-h6 2xl:text-h5 text-center relative text-white">
              <div className="absolute left-0 top-0 text-h3 text-black/50 -z-10 -translate-x-[20%] -translate-y-[40%]">{pad2(idx + 1)}</div>
              <span className="text-strokfe">{user.name}</span>
            </div>
            <div className="flex items pt-4">
              <button className="w-1/3 h-8 text-3xl shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all flex justify-center items-center"
                      onClick={() => moveUserLeft(user)}><ArrowUpOutlineIcon /></button>
              <button className="w-1/3 h-8 text-3xl shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all flex justify-center items-center"
                      onClick={() => removeUserFromNewSession(user)}><CancelIcon /></button>
              <button className="w-1/3 h-8 text-3xl shadow-none hover:-mt-1 hover:shadow hover:rounded hover:bg-white/60 transition-all flex justify-center items-center"
                      onClick={() => moveUserRight(user)}><ArrowDownOutlineIcon /></button>
            </div>
          </div>)}
        </div>
        <div className="basis-1/2">
          <List<User>
            header=""
            items={users}
            selected={newSessionUsers}
            refresh={refreshUsers}
            select={addUserToNewSession}
            itemKey={({ id }) => id}
            serialize={({ name }) => name}
          />
        </div>
      </div>
    </>}

    {/* Редактирование игроков */}
    {canCreate && adminScreen === 'users' && <>
      <div className="w-full h-max my-auto min-h-[50%] flex flex-row flex-nowrap items-start gap-5">
        <div className="sticky top-10 basis-1/2 p-4 rounded-md shadow bg-white/40 border border-white mb-5">
          <h6 className="text-h7">Добавить игрока</h6>
          <Input buttonText="Добавить" layout="col" submit={createUser} />
        </div>
        <div className="basis-1/2">
          <List<User>
            header="Игроки"
            items={users}
            refresh={refreshUsers}
            select={() => {}}
            itemKey={({ id }) => id}
            serialize={({ name }) => name}
          />
        </div>
      </div>
    </>}
  </Page>;
};

export default GameAdmin;

