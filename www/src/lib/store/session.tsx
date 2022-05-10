import { createEffect, createStore } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { CreateSessionRequest, request, RestTask, ServerTask, Session } from '../api';

export const session = createStore<Session>(null, { name: 'Session id' });
export const availableSessions = createStore<Session[]>([], {
  name: 'Available sessions',
  updateFilter: (newSessions, oldSessions) => newSessions.length !== oldSessions.length || newSessions.some((s, i) => s !== oldSessions[i]),
});

export const createSession = createEffect({
  name: 'CreateSession',
  handler: (name: string, users: number[]) => getConnectionInstance().invoke<void>(ServerTask.CreateSession, {
    SessionName: name,
    UserIds: users
  } as CreateSessionRequest),
})

export const joinSession = createEffect({
  name: 'Join session',
  handler: (id: Session) => getConnectionInstance().invoke<void>(ServerTask.JoinSession, id),
});

export const refreshAvailable = createEffect({
  name: 'Refresh available sessions',
  handler: () => request<Session[], void>('GET', RestTask.Sessions),
});

session.on(joinSession.done, (prevSession, { params: joinedSession } ) => joinedSession);
availableSessions.on(refreshAvailable.doneData, sessions => sessions);
createSession.done.watch(() => refreshAvailable());

(window as any).debug = {
  ...(window as any).debug ?? {},
  refreshAvailableSessions: refreshAvailable,
}

