import React from 'react';

import './throbber.css';
import { ReactComponent as SmileyCorrect } from '../../../assets/smileyCorrect.svg';
import { ReactComponent as SmileyIncorrect } from '../../../assets/smileyIncorrect.svg';
import { ReactComponent as SmileyBank } from '../../../assets/smileyBank.svg';

export default () => <div className='Throbber'>
  <SmileyCorrect/>
  <SmileyIncorrect/>
  <SmileyBank/>
</div>
