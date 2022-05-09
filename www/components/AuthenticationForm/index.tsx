import React, { useCallback } from 'react';

import { Authentication, Role } from '../../lib/constants';
import Page from '../Page';
import './authenticationForm.css';
import Button from '../Button';
import Throbber from '../Throbber';

export default (
  {
    authentication,
    authenticate,
  }:
    {
      role?: Role,
      authentication: Authentication,
      authenticate: (role) => void,
    }) => {
  const authenticateAsAdmin = useCallback(() => authenticate(Role.Admin), [authenticate]);
  const authenticateAsPlayer = useCallback(() => authenticate(Role.Player), [authenticate]);

  if (authentication === Authentication.Authenticated) {
    return null;
  }

  return <Page>
    <h1 className="AuthenticationForm__header">Авторизация</h1>
    <div className="AuthenticationForm__form">
      {
        (authentication === Authentication.Pending) && <Throbber/>
      }
      {
        authentication === Authentication.None && <>
          <Button text="Ведущий" color="var(--vk-blue-color)" handler={authenticateAsAdmin} />
          <Button text="Ассистент" color="var(--vk-blue-color)" handler={authenticateAsAdmin} />
          <Button text="Игрок" color="var(--vk-magenta-color)" handler={authenticateAsPlayer} />
          <Button text="Зритель" color="var(--vk-magenta-color)" handler={authenticateAsPlayer} />
        </>
      }
    </div>
  </Page>
}
