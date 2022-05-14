import React from 'react';
import type { FunctionComponent } from 'react';
import Page from '../Page';

import './game.css';

interface Props {
  score: () => JSX.Element,
  main: () => JSX.Element,
  footer: () => JSX.Element,
}

const Game: FunctionComponent<Props> = ({ score, footer, main }) => {
  return <Page>
    <div className="Game grid grid-rows-5 grid-cols-7 content-between gap-2 h-full relative">
      <div className="row-span-4 col-span-1">
        {score()}
      </div>
      <div className="row-span-4 col-span-6">
        {main()}
      </div>
      <div className="row-span-1 col-span-7 grid-flow-row mt-12">
        {footer()}
      </div>
    </div>
  </Page>;
};

export default Game;

