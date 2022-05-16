import React, { FC } from 'react';
import cn from 'classnames';

interface Props {
  value: number;
}

const COLS = 8;
const ROWS = 32;

const Score: FC<Props> = ({ value = 0 }) => {
  return <div className="grid grid-rows-32 grid-cols-8 gap-[0.1rem] 2xl:gap-[0.3rem] place-content-around w-fit h-full" style={{'direction': 'rtl'}}>
    {Array(COLS * ROWS).fill(0).map((col, idx) => {
      const revIdx = COLS * ROWS - 1 - idx;

      return <div key={idx} className={cn('bg-black opacity-10 rounded-sm w-4 h-4 2xl:h-5 2xl:w-5', {
        '!bg-score !opacity-100': revIdx < value
      })}>&nbsp;</div>;
    })}
  </div>;
};

export {
  Score,
};
