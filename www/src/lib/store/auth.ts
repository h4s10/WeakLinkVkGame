import { createEffect, createEvent, createStore } from 'effector-logger';
import { ServerTask } from '../api';
import { Authentication, Role } from '../constants';
import { getConnectionInstance } from '../connection';

export const authentication = createStore<Authentication>(Authentication.None, { name: 'Authentication status' });
export const authenticate = createEffect((role: Role) => getConnectionInstance().invoke(ServerTask.Join, role));

export const role = createStore<Role | null>(null, { name: 'Current role' });

const acceptAuth = createEvent('Authentication successful');
const revokeAuth = createEvent('Authentication revoked');

authenticate.done.watch(() => acceptAuth());
authenticate.fail.watch(() => revokeAuth());

authentication
  .on(authenticate, () => Authentication.Pending)
  .on(acceptAuth, () => Authentication.Authenticated)
  .on(revokeAuth, () => Authentication.None);

role.on(authenticate, (prevRole, newRole) => newRole);
role.on(acceptAuth, (prevRole, newRole) => newRole);
role.on(revokeAuth, () => null);


(window as any).debug = {
  ...(window as any).debug ?? {},
  acceptAuth,
  revokeAuth,
}
