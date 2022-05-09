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
    <h1 className="text-h4 mb-2">Авторизация</h1>
    <div className="flex w-full gap-2 my-auto align-middle rounded bg-white p-10">
      {
        (authentication === Authentication.Pending) && <Throbber/>
      }
      {
        authentication === Authentication.None && <>
          <Button className="bg-vk-blue" text="Ведущий" handler={authenticateAsAdmin} />
          <Button className="bg-vk-blue" text="Ассистент" handler={authenticateAsAdmin} />
          <Button className="bg-vk-magenta" text="Игрок" handler={authenticateAsPlayer} />
          <Button className="bg-vk-magenta" text="Зритель" handler={authenticateAsPlayer} />
        </>
      }
    </div>
  </Page>
}
