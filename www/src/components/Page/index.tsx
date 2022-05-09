import React from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import './page.css';

export interface Props {
  children: ReactNode
}

const Page: FunctionComponent<Props> = ({ children }) => <div className="Page">{ children }</div>;

export default Page
