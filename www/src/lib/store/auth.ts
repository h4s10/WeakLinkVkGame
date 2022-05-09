import { createEffect, createEvent, createStore } from 'effector';
import { ServerTask } from '../api';
import { Authentication, Role } from '../constants';
import { getConnection } from '../connection';

export const authentication = createStore<Authentication>(Authentication.None);
export const authenticate = createEvent();

export const role = createStore<Role | null>(null);

const authenticateEffect = createEffect(async (role: Role) => await getConnection().send(ServerTask.Join, role));
authentication.on(authenticate, () => Authentication.Pending);
role.on(authenticate, (role) => role);

authentication.on(authenticateEffect.done, () => Authentication.Authenticated);
authentication.on(authenticateEffect.fail, () => Authentication.None);
role.on(authenticateEffect.fail, () => null);



authentication.watch(v => console.log('authentication:', v));
role.watch(v => console.log('role:', v));
