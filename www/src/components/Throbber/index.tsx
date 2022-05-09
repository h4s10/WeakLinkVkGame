import React from 'react';

import './throbber.css';
import SmileyCorrect from '../../../assets/smileyCorrect.svg';
import SmileyIncorrect from '../../../assets/smileyIncorrect.svg';
import SmileyBank from '../../../assets/smileyBank.svg';

export default () => <div className='Throbber'>
  <SmileyCorrect/>
  <SmileyIncorrect/>
  <SmileyBank/>
</div>
