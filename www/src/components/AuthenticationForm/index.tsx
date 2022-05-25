import React, { useCallback } from 'react';

import { Authentication, Role } from '../../lib/constants';
import Page from '../Page';
import { ReactComponent as VkLogo } from '../../../assets/vk.svg';
import splashPattern from '../../../assets/splashPattern.svg';

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
    <img className="absolute inset-0 -z-10" src={splashPattern} />
    <div className="text-h4 mb-2 flex items-center gap-12"><VkLogo />cлабое звено</div>
    <div className="flex flex-col gap-2 p-10 min-h-[32rem] mt-20 w-fit">
      {
        authentication === Authentication.None && <>
          <div className="!justify-start text-h6 2xl:text-h5 text-ellipsis cursor-pointer select-none box-content hover:pl-20 py-5 transition-all hover:border-b-2 border-white" onClick={authenticateAsAdmin}>Ведущий</div>
          <div className="!justify-start text-h6 2xl:text-h5 text-ellipsis cursor-pointer select-none box-content hover:pl-20 py-5 transition-all hover:border-b-2 border-white" onClick={authenticateAsAdmin}>Ассистент</div>
          <div className="!justify-start text-h6 2xl:text-h5 text-ellipsis cursor-pointer select-none box-content hover:pl-20 py-5 transition-all hover:border-b-2 border-white" onClick={authenticateAsPlayer}>Игрок</div>
          <div className="!justify-start text-h6 2xl:text-h5 text-ellipsis cursor-pointer select-none box-content hover:pl-20 py-5 transition-all hover:border-b-2 border-white" onClick={authenticateAsPlayer}>Зритель</div>
        </>
      }
    </div>
  </Page>
}
