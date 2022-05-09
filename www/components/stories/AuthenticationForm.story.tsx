import React from 'react';

import '../global.css';
import type { Story } from '@ladle/react';
import AuthenticationForm from '../AuthenticationForm';
import { Authentication, Role } from '../../lib/constants';

const mockAuthentication = (role, succeedOnSubmit) => {
  console.log('authenticating as', role, succeedOnSubmit ? 'successfully' : 'with failure');
  return succeedOnSubmit ? Promise.resolve() : Promise.reject();
}

export const AuthenticationFormConfigurable: Story<{
  defaultRole: string[],
  currentAuthentication: string[],
  succeedOnSubmit: boolean
}> = ({
  defaultRole,
  currentAuthentication,
  succeedOnSubmit,
}) => <AuthenticationForm authentication={currentAuthentication} role={defaultRole} authenticate={(role) => mockAuthentication(role, succeedOnSubmit)}/>;

AuthenticationFormConfigurable.args = {
  succeedOnSubmit: true,
}
AuthenticationFormConfigurable.argTypes = {
  defaultRole: {
    options: [Role.Admin, Role.Player],
    control: { type: "radio" },
    defaultValue: Role.Player,
  },
  currentAuthentication: {
    options: [Authentication.None, Authentication.Pending, Authentication.Authenticated],
    control: { type: "select" },
    defaultValue: Authentication.None,
  },
}
