import React from 'react';

import './throbber.css';
import SmileyCorrect from '../../../assets/smileyCorrect.svg';
import SmileyIncorrect from '../../../assets/smileyIncorrect.svg';
import SmileyBank from '../../../assets/smileyBank.svg';

export default () => <div className='Throbber'>
  <SmileyCorrect className='Throbber_a'/>
  <SmileyIncorrect className='Throbber_b'/>
  <SmileyBank className='Throbber_c'/>
</div>
