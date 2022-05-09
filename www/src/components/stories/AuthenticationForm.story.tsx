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
  currentAuthentication: Authentication,
  succeedOnSubmit: boolean
}> = ({
  currentAuthentication,
  succeedOnSubmit,
}) => <AuthenticationForm authentication={currentAuthentication} authenticate={(role) => mockAuthentication(role, succeedOnSubmit)}/>;

AuthenticationFormConfigurable.args = {
  succeedOnSubmit: true,
}
AuthenticationFormConfigurable.argTypes = {
  currentAuthentication: {
    options: [Authentication.None, Authentication.Pending, Authentication.Authenticated],
    control: { type: "select" },
    defaultValue: Authentication.None,
  },
}
