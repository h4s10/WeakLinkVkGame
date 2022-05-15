import { createEffect, createEvent, createStore } from 'effector-logger';
import { getConnectionInstance } from '../connection';
import { CreateSessionRequest, request, RestTask, ServerTask, Session } from '../api';
import { roundUpdate } from './serverEvents';

export const session = createStore<Session['id']>(null, { name: 'Session id' });
export const availableSessions = createStore<Session[]>([], {
  name: 'Available sessions',
  updateFilter: (newSessions, oldSessions) => newSessions.length !== oldSessions.length || newSessions.some((s, i) => s.id !== oldSessions[i].id),
});

export const setSession = createEvent<Session['id']>('Set session');

export const createSession = createEffect({
  name: 'Create session',
  handler: ({ name, users }: {name: string, users: number[]}) => getConnectionInstance().invoke<void>(ServerTask.CreateSession, {
    SessionName: name,
    UserIds: users
  } as CreateSessionRequest),
});

export const refreshAvailable = createEffect({
  name: 'Refresh available sessions',
  handler: () => request<Session[], void>('GET', RestTask.Sessions),
});

export const refreshState = createEffect({
  name: 'Refresh session state',
  handler: (id = session.getState()) => getConnectionInstance().invoke(ServerTask.GetSessionState, id),
});

session.on(setSession, (oldSession, newSession) => newSession);
availableSessions.on(refreshAvailable.doneData, (prevSessions, newSessions) => newSessions);
createSession.finally.watch(() => refreshAvailable());

session.watch((session) => session !== null && refreshState());

session.on(roundUpdate, (session, { sessionId }) => sessionId);

(window as any).debug = {
  ...(window as any).debug ?? {},
  refreshAvailableSessions: refreshAvailable,
  refreshSessionState: refreshState,
}

