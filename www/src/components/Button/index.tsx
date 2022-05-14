import React, { useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';
import cn from 'classnames';
import './button.css';

export interface Props {
  className?: string,
  handler: () => void,
  children: JSX.Element | string,
}

const Button: FunctionComponent<Props> = ({ children, className, handler }) => {
  const onClick: MouseEventHandler = useCallback((event) => {
    event.preventDefault();
    handler();
  }, [handler]);

  const defaultClassName = 'Button w-full text-ellipsis overflow-hidden text-center cursor-pointer select-none transition-shadow hover:shadow-md';
  return <div className={cn(defaultClassName, className)} onClick={onClick}>{children}</div>;
};

export default Button;

