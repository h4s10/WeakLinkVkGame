import React from 'react';
import type { FunctionComponent } from 'react';
import Button, { Props as BaseProps } from './Button';

export interface Props extends BaseProps {
  active: boolean;
}

const TabButton: FunctionComponent<Props> = ({ active, className, ...base }) =>
  <Button
    className={`${className} ${active ? 'bg-inactive text-active' : 'bg-active text-inactive'} max-w-max px-20 text-h5`}
    { ...base }
  />

export default TabButton
