import React, { useCallback } from 'react';

import { Authentication, Role } from '../../lib/constants';
import Page from '../Page';
import Button from '../Button';
import Throbber from '../Throbber';

export default (
  {
    authentication,
    authenticate,
  }:
    {
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
    <div className="flex w-full gap-2 my-auto align-middle items-center rounded bg-white place-content-evenly p-10 min-h-[32rem]">
      {
        (authentication === Authentication.Pending) && <div className="h-20"><Throbber/></div>
      }
      {
        authentication === Authentication.None && <>
          <Button className="bg-vk-blue" handler={authenticateAsAdmin}>Ведущий</Button>
          <Button className="bg-vk-blue" handler={authenticateAsAdmin}>Ассистент</Button>
          <Button className="bg-vk-magenta" handler={authenticateAsPlayer}>Игрок</Button>
          <Button className="bg-vk-magenta" handler={authenticateAsPlayer}>Зритель</Button>
        </>
      }
    </div>
  </Page>
}
