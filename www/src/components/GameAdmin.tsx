import React, { useCallback, useState } from 'react';
import type { FunctionComponent } from 'react';
import { Session, User } from '../lib/api';
import Page from './Page';
import Button from './Button';
import Input from './Input';
import TabButton from './TabButton';
import List from '../List';

interface Props {
  canCreate: boolean,
  sessions: Session[],
  refreshSessions: () => Promise<any>,
  selectSession: (id: Session['id']) => void,
  createNewSession: (data: {name: string, users: User['id'][]}) => void,
  users: User[],
  createUser: (name: string) => Promise<void>,
  refreshUsers: () => Promise<any>,
}

const MAX_USERS_PER_SESSION = 6;

const GameAdmin: FunctionComponent<Props> = ({
   canCreate,
   sessions,
   refreshSessions,
   selectSession,
   createNewSession,
   users,
   createUser,
   refreshUsers,
}) => {
  const [adminScreen, setAdminScreen] = useState<'sessions' | 'users' | 'sessionUsers'>('sessions');
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionUsers, setNewSessionUsers] = useState<User[]>([]);

  const startSessionCreation = useCallback((name) => {
    setAdminScreen('sessionUsers');
    setNewSessionName(name);
  }, []);

  const abortSessionCreation = useCallback(() => {
    setAdminScreen('sessions');
    setNewSessionName('');
    setNewSessionUsers([]);
  }, []);

  const createSession = useCallback(() => {
    createNewSession({ name: newSessionName, users: newSessionUsers.map(({id}) => id) });
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
    <div className='flex gap-5'>
      <h1 className="text-h4 mb-2">{ adminScreen === 'users' ? 'Игроки' : 'Выбор игры' }</h1>
      {
        canCreate && ['sessions', 'users'].includes(adminScreen) && <>
          <div className="ml-auto"/>
          <TabButton active={adminScreen === 'sessions'} text='Игры' handler={() => setAdminScreen('sessions')} />
          <TabButton active={adminScreen === 'users'} text='Игроки' handler={() => setAdminScreen('users')} />
        </>
      }
    </div>
    <div className="w-full h-max my-auto rounded bg-white p-10 min-h-[50%]">
      {/* Создание игры */}
      { (!canCreate || adminScreen === 'sessions') && <>
        {
          canCreate && <>
            <h5 className="text-dark text-h5 mb-5">Новая игра</h5>
            <Input buttonText="Добавить" handler={startSessionCreation}/>
          </>
        }
        <List<Session>
          header="Игры в процессе"
          items={sessions}
          refresh={refreshSessions}
          select={({ id }) => selectSession(id)}
          itemKey={({ id }) => id }
          serialize={({ name }) => name}
        />
        {
          !canCreate && !sessions.length && <div className="flex gap-5 flex-col items-center text-center content-center">
            <h4 className="text-h4 text-dark">Нет доступных игр.</h4>
            <h4 className="text-h5 text-dark">Дождитесь когда Ведущий создаст игру.</h4>
          </div>
        }
      </> }

      {/* Наполнение игры */}
      {canCreate && adminScreen === 'sessionUsers' && <>
        <div className='flex gap-5'>
          <h5 className="text-dark text-h5 mb-5">Игроки «{newSessionName}»</h5>
          <div className="ml-auto"/>
          <Button className='bg-incorrect max-w-max px-10' text='Отмена' handler={abortSessionCreation}/>
          <Button className='bg-correct max-w-max px-10' text='Создать' handler={createSession}/>
        </div>

        <div className="grid grid-cols-3 grid-rows-2">
          { newSessionUsers.map(user => <div key={user.id} className="rounded rounded-xl border-4 bg-dark">
            <h4 className="text-h4 text-center" >{ user.name }</h4>
            <div className="flex">
              <button className="w-1/3 h-10 text-3xl leading-5" onClick={() => moveUserLeft(user)}>◀</button>
              <button className="w-1/3 h-10 text-3xl leading-5" onClick={() => removeUserFromNewSession(user)}>✕</button>
              <button className="w-1/3 h-10 text-3xl leading-5" onClick={() => moveUserRight(user)}>▶</button>
            </div>
          </div>) }
        </div>

        <List<User>
          header="Все игроки"
          items={users}
          refresh={refreshUsers}
          select={addUserToNewSession}
          itemKey={({ id }) => id }
          serialize={({ name }) => name}
        />
      </>}

      {/* Редактирование игроков */}
      { canCreate && adminScreen === 'users' && <>
        <h5 className="text-dark text-h5 mb-5">Добавить игрока</h5>
        <Input buttonText="Добавить" handler={createUser}/>
        <List<User>
          header="Игроки"
          items={users}
          refresh={refreshUsers}
          select={() => {}}
          itemKey={({ id }) => id }
          serialize={({ name }) => name}
        />
      </> }
    </div>
  </Page>
}

export default GameAdmin;

