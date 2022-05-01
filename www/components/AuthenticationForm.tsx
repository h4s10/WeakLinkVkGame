import React, { useCallback, useRef } from 'react';

import { Authentication, Role } from '../lib/constants';

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
  const roleRef = useRef<HTMLInputElement>();

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

  return <>
    <select id="role" ref={roleRef} defaultValue={role}>
      <option value={Role.Admin}>Admin</option>
      <option value={Role.Player}>Player</option>
    </select>
    <button onClick={submit}>Authenticate</button>
  </>
}
