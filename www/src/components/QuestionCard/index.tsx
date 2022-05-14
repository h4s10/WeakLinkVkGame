import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Player, Question } from '../../lib/types';
import { QuestionVerdict, Role } from '../../lib/constants';
import Avatar from '../../../assets/avatarBig.svg';
import Cancel from '../../../assets/cancelOutline.svg';
import QMark from '../../../assets/questionMark.svg';

import Button from '../Button';
import cn from 'classnames';

interface Props {
  player: Player,
  question: Question,
  role: Role,
  onVerdict: (value: QuestionVerdict) => void;
  onClose: () => void;
}

const QuestionCard: FC<Props> = ({ player, question, role, onVerdict, onClose }) => {
  const [playerAnswer, setPlayerAnswer] = useState(null);

  const { text = '', variants = [], answer = '' } = question;
  return <div className="flex flex-col bg-white text-black rounded-md w-full h-full p-[3.125rem]">
    <div className="flex flex-row flex-nowrap leading-[2.75rem] pb-[1rem] 2xl:pb-[2rem]">
      <div className="flex-none mr-12"><Avatar /></div>
      <div className="flex-1 text-h5 2xl:text-h4 leading-[5rem] truncate">Отвечает <span className="font-bold">{player.name}</span></div>
      <div className="flex-none cursor-pointer" onClick={() => onClose() }><Cancel /></div>
    </div>
    <hr />
    <div className="flex-1 pt-[1.5rem] 2xl:pt-[2.75rem] flex gap-2 flex-col justify-around">
      <div className="flex flex-wrap">
        <div className="mr-[2.25rem]">
          <QMark />
        </div>
        <div className="flex-1">
          <ReactMarkdown className="text-h7 2xl:text-h5">{text}</ReactMarkdown>
        </div>
      </div>
      {variants.length ? <div className="flex gap-4">
        {variants.map(((variant, idx) =>
            <Button className={cn('flex-1 bg-muted text-vk-blue rounded-md', {
              'shadow shadow-correct border border-correct': +answer === idx
            })} key={idx} handler={() => {}}>
              <ReactMarkdown>{variant.label}</ReactMarkdown>
            </Button>
        ))}
      </div> : <div className="text-h5 py-2 px-8 rounded-lg border-4 border-correct shadow-md"><ReactMarkdown>{answer}</ReactMarkdown></div>}
      {role === Role.Admin ? <div className="flex gap-4">
        <div className="basis-1/2 flex-1 flex">
          <Button className="basis-1/2 flex-none bg-neutral text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg"
                  handler={() => {onVerdict(QuestionVerdict.bank);}}>
            Банк
          </Button>
        </div>
        <div className="basis-1/2 flex-1 flex gap-2">
          <Button className="bg-incorrect text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg"
                  handler={() => {onVerdict(QuestionVerdict.incorrect);}}>
            Неправильно
          </Button>
          <Button className="bg-correct text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg"
                  handler={() => {onVerdict(QuestionVerdict.correct);}}>
            Правильно
          </Button>
        </div>
      </div> : null}
    </div>
  </div>;
};

export {
  QuestionCard,
};
