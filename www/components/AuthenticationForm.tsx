import React, { useCallback, useRef } from 'react';

import { authenticate, authentication as authenticationStore, role as roleStore } from '../lib/store/auth';
import { useStore } from 'effector-react';
import { Authentication, Role } from '../lib/constants';

export default () => {
  const role = useStore(roleStore);
  const authentication = useStore(authenticationStore);

  const roleRef = useRef<HTMLInputElement>();

  if (authentication === Authentication.Authenticated) {
    return null;
  }

  if (authentication === Authentication.Pending) {
    return <b>'Authenticating...'</b>;
  }

  const submit = useCallback(() => {
    if (roleRef.current?.value) {
      authenticate(roleRef.current?.value);
    }
  }, [authenticate]);

  return <>
    <select id="role" ref={roleRef} defaultValue={role ?? ''}>
      <option value={Role.Admin}>Admin</option>
      <option value={Role.Player}>Player</option>
    </select>
    <button onClick={submit}>Authenticate</button>
  </>
}
