import React, { ReactNode, useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';
import cn from 'classnames';
import './button.css';

export interface Props {
  className?: string,
  ignoreInnerStyle?: boolean;
  handler: () => void,
  children: ReactNode,
}

const Button: FunctionComponent<Props> = ({ children, className, ignoreInnerStyle = false, handler }) => {
  const onClick: MouseEventHandler = useCallback((event) => {
    event.preventDefault();
    handler();
  }, [handler]);

  const defaultSizing = 'h-[4rem] 2xl:h-[6.25rem] text-h7 2xl:text-h6 w-full';
  const defaultClassName = 'flex items-center justify-center text-ellipsis overflow-hidden text-center cursor-pointer select-none transition-shadow hover:shadow-md box-content';
  return <div className={cn(!ignoreInnerStyle && defaultSizing, defaultClassName,className)} onClick={onClick}><span>{children}</span></div>;
};

export default Button;

