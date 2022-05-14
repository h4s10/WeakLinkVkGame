import { createEffect, createStore } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { CreateSessionRequest, request, RestTask, ServerTask, Session } from '../api';

export const session = createStore<Session['id']>(null, { name: 'Session id' });
export const availableSessions = createStore<Session[]>([], {
  name: 'Available sessions',
  updateFilter: (newSessions, oldSessions) => newSessions.length !== oldSessions.length || newSessions.some((s, i) => s.id !== oldSessions[i].id),
});

export const createSession = createEffect({
  name: 'CreateSession',
  handler: ({ name, users }: {name: string, users: number[]}) => getConnectionInstance().invoke<void>(ServerTask.CreateSession, {
    SessionName: name,
    UserIds: users
  } as CreateSessionRequest),
})

export const joinSession = createEffect({
  name: 'Join session',
  handler: (id: Session['id']) => getConnectionInstance().invoke<void>(ServerTask.JoinSession, id),
});

export const refreshAvailable = createEffect({
  name: 'Refresh available sessions',
  handler: () => request<Session[], void>('GET', RestTask.Sessions),
});

session.on(joinSession.doneData, (prevSession, joinedSession) => joinedSession);
availableSessions.on(refreshAvailable.doneData, (prevSessions, newSessions) => newSessions);
createSession.finally.watch(() => refreshAvailable());

(window as any).debug = {
  ...(window as any).debug ?? {},
  refreshAvailableSessions: refreshAvailable,
}

