import React, { useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';
import cn from 'classnames';
import './button.css';

interface Props {
  text: string,
  className?: string,
  handler: () => void,
}

const Button: FunctionComponent<Props> = ({ text, className, handler }) => {
  const onClick: MouseEventHandler = useCallback((event) => {
    event.preventDefault();
    handler();
  }, [handler]);

  const defaultClassName = 'Button w-full rounded-md text-ellipsis overflow-hidden text-center cursor-pointer select-none';
  return <div className={cn(defaultClassName, className)} onClick={ onClick }>{ text }</div>
}

export default Button;

