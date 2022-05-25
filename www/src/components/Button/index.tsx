import React, { ReactNode, useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';
import cn from 'classnames';
import './button.css';

export interface Props {
  className?: string,
  ignoreInnerStyle?: boolean;
  handler?: () => void,
  children: ReactNode,
  focused?: boolean,
}

const Button: FunctionComponent<Props> = ({ children, className, focused, ignoreInnerStyle = false, handler }) => {
  const onClick: MouseEventHandler = useCallback((event) => {
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [handler]);

  const defaultSizing = 'h-[4rem] 2xl:h-[6.25rem] text-h8 2xl:text-h6 w-full';
  const defaultClassName = 'flex items-center justify-center text-ellipsis overflow-hidden cursor-pointer select-none transition-shadow text-center';
  return <button autoFocus={focused} className={cn(!ignoreInnerStyle && defaultSizing, defaultClassName, className)} onClick={onClick}><span>{children}</span></button>;
};

export default Button;

