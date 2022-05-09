import React from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import './page.css';

export interface Props {
  children: ReactNode;
}

const Page: FunctionComponent<Props> = ({ children }) =>
  <div className="w-full h-full container mx-auto">{children}</div>;

export default Page;
