import React from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import './page.css';

export interface Props {
  children: ReactNode;
}

const Page: FunctionComponent<Props> = ({ children }) =>
  <div className="Page w-full h-full mx-auto">{children}</div>;

export default Page;
