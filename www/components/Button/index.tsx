import React, { MouseEventHandler, useCallback } from 'react';
import type { FunctionComponent } from 'react';
import './button.css';
import { AnswerColor } from '../../lib/constants';

interface Props {
  text: string,
  color: AnswerColor | string,
  handler: () => void,
}

const Button: FunctionComponent<Props> = ({ text, color, handler }) => {
  const onClick: MouseEventHandler = useCallback((event) => {
    event.preventDefault();
    handler();
  }, [handler]);

  const backgroundColor = AnswerColor[color] ?? color;

  return <div className='Button__container' style ={ { backgroundColor } } onClick={ onClick }>{ text }</div>
}

export default Button;

