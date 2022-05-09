import React, { useCallback, useRef } from 'react';

import { Authentication, Role } from '../../lib/constants';
import Page from '../Page';

export default (
  {
    role,
    authentication,
    authenticate,
  }:
    {
      role?: Role,
      authentication: Authentication,
      authenticate: (role) => void,
    }) => {
  const roleRef = useRef<HTMLSelectElement>();

  const submit = useCallback(() => {
    if (roleRef.current?.value) {
      authenticate(roleRef.current?.value);
    }
  }, [authenticate]);

  if (authentication === Authentication.Authenticated) {
    return null;
  }

  if (authentication === Authentication.Pending) {
    return <b>Authenticating...</b>;
  }

  return <Page>
    <h1>Авторизация</h1>
    <select id="role" ref={roleRef} defaultValue={role}>
      <option value={Role.Admin}>Admin</option>
      <option value={Role.Player}>Player</option>
    </select>
    <button onClick={submit}>Authenticate</button>
  </Page>
}
