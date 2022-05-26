import React from 'react';
import type { FunctionComponent } from 'react';
import Button, { Props as BaseProps } from '../Button';
import cn from 'classnames';

export interface Props extends BaseProps {
  active: boolean;
}

const TabButton: FunctionComponent<Props> = ({ active, className, ...baseProps }) =>
  <Button
    className={cn('transition-spacing max-w-max h-12 2xl:h-16 px-12 text-h8 2xl:text-h7 first:rounded-l-lg last:rounded-r-lg text-active', className, {
      '!text-black bg-active h-14 2xl:h-[4.5rem] -mt-1 rounded-lg shadow-lg': active
    })}
    ignoreInnerStyle={true}
    { ...baseProps }
  />

export {
  TabButton
}
