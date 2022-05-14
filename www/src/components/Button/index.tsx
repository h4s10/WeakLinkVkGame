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

  const defaultClassName = 'h-[4rem] leading-[3.7rem] 2xl:h-[6.25rem] 2xl:leading-[5.6rem] text-h7 2xl:text-h6 w-full text-ellipsis overflow-hidden text-center cursor-pointer select-none transition-shadow hover:shadow-md';
  return <div className={cn(defaultClassName, className)} onClick={onClick}><span>{children}</span></div>;
};

export default Button;

