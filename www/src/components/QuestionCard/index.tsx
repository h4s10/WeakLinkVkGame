import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { QuestionVerdict, Role } from '../../lib/constants';
import { ReactComponent as Avatar } from '../../../assets/avatarBig.svg';
import { ReactComponent as Cancel } from '../../../assets/cancelOutline.svg';
import { ReactComponent as QMark } from '../../../assets/questionMark.svg';

import Button from '../Button';
import cn from 'classnames';
import { Question, UserRound } from '../../lib/api';

interface Props {
  player: UserRound,
  question: Question,
  role: Role,
  onVerdict: (value: QuestionVerdict) => void;
  onClose: () => void;
}

const QuestionCard: FC<Props> = ({ player, question, role, onVerdict, onClose }) => {
  const { text = '', answers = [] } = question;
  const [shine, setShine] = useState<QuestionVerdict | null>(null);

  const onKeyPress: EventListener = useCallback((event: KeyboardEvent) => {
    if (
      role === Role.Admin &&
      !(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey)
    ) {
      let handled = false;
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          handled = true;
          setShine(QuestionVerdict.correct);
          onVerdict(QuestionVerdict.correct);
          break;

        case 'ArrowLeft':
          handled = true;
          setShine(QuestionVerdict.incorrect);
          onVerdict(QuestionVerdict.incorrect);
          break;

        case 'ArrowDown':
        case 'b':
          handled = true;
          setShine(QuestionVerdict.bank);
          onVerdict(QuestionVerdict.bank);
          break;
      }

      if (handled) {
        event.preventDefault();
      }
    }
  }, [role, onVerdict]);

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyPress);
    return () => document.body.removeEventListener('keydown', onKeyPress);
  }, [onKeyPress]);

  useEffect(() => {
    setShine(null);
  }, [question]);

  return <div className="relative flex flex-col bg-white text-black rounded-md w-full h-full p-[3.125rem] z-10">
    <div className="flex flex-row flex-nowrap leading-[2.75rem] pb-[1rem] 2xl:pb-[2rem]">
      <div className="flex-none mr-12"><Avatar /></div>
      <div className="flex-1 text-h5 2xl:text-h4 leading-[5rem] truncate">Отвечает <span className="font-bold">{player.name}</span></div>
      <div className="flex-none cursor-pointer" onClick={() => onClose()}><Cancel /></div>
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
      {answers.length > 1 ? <div className="flex gap-4">
        {answers.map(((answer) =>
            <Button className={cn('text-h7 2xl:text-h6 p-2 px-6 flex-1 bg-muted text-vk-blue rounded-md relative text-center', {
              'shadow shadow-correct border border-correct': role === Role.Admin && answer.isCorrect,
            })} ignoreInnerStyle={true} key={answer.id} handler={() => {}}>
              { (answer.text ?? null) && <ReactMarkdown>{answer.text}</ReactMarkdown> }
            </Button>
        ))}
      </div> :
        (role === Role.Admin && answers[0]?.text) && <div className='text-h5 py-2 px-8 rounded-lg border-4 shadow-md border-correct'>
          <ReactMarkdown>{answers[0].text}</ReactMarkdown>
        </div>
      }
      {role === Role.Admin ? <div className="flex gap-4">
        <div className="basis-1/2 flex-1 flex">
          <Button className={cn('basis-1/2 flex-none bg-neutral text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg', {
            'shadow-neutral/90 animate-ping': shine === QuestionVerdict.bank,
          })}
                  handler={() => {onVerdict(QuestionVerdict.bank);}}>
            Банк
          </Button>
        </div>
        <div className="basis-1/2 flex-1 flex gap-2">
          <Button className={cn('bg-incorrect text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg', {
            'shadow-incorrect/90 animate-ping': shine === QuestionVerdict.incorrect,
          })}
                  handler={() => {onVerdict(QuestionVerdict.incorrect);}}>
            Неправильно
          </Button>
          <Button className={cn('bg-correct text-white rounded-lg border-4 border-white shadow-md hover:shadow-lg', {
            'shadow-correct/90 animate-ping': shine === QuestionVerdict.correct,
          })}
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
