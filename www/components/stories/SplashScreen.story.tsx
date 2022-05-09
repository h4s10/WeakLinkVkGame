import React from 'react';

import type { Story } from '@ladle/react';
import SplashScreen from '../splash/SplashScreen';

export const SplashConfigurable: Story<{
  text: string,
}> = ({ text }) => <SplashScreen/>

SplashConfigurable.args = {
  text: '',
}
