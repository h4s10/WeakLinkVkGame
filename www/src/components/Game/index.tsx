import React, { ReactNode } from 'react';
import type { FunctionComponent } from 'react';
import Page from '../Page';

import './game.css';

interface Props {
  score: () => ReactNode,
  main: () => ReactNode,
  footer: () => ReactNode,
}

const Game: FunctionComponent<Props> = ({ score, footer, main }) => {
  return <Page>
    <div className="Game grid grid-rows-5 grid-cols-7 content-between gap-2 h-full relative">
      <div className="row-span-4 col-span-1 relative">
        {score()}
      </div>
      <div className="row-span-4 col-span-6 relative">
        {main()}
      </div>
      <div className="row-span-1 col-span-7 grid-flow-row mt-12 relative">
        {footer()}
      </div>
    </div>
  </Page>;
};

export default Game;

