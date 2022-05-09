import React from 'react';

import '../global.css';
import type { Story } from '@ladle/react';
import Button from '../Button';
import { AnswerColor } from '../../lib/constants';

const logHandler = () => console.log('button clicked');

export const CorrectButton = () => <Button text="Правильно" color={AnswerColor.Correct} handler={logHandler}/>
export const IncorrectButton = () => <Button text="Неправильно" color={AnswerColor.Incorrect} handler={logHandler}/>
export const BankButton = () => <Button text="Банк" color={AnswerColor.Neutral} handler={logHandler}/>

export const ButtonConfigurable: Story<{
  text: string,
  color: AnswerColor | string,
}> = (props) => <Button { ...props } handler={ logHandler }/>

ButtonConfigurable.args = {
  text: 'текст',
  color: 'blueviolet',
}
