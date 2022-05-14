import React, { FC, useState } from 'react';

import { Player, PlayerGameStatus, Question } from '../../lib/types';
import { Role } from '../../lib/constants';

import { QuestionCard } from '../../components/QuestionCard';
import { PlayersGrid } from '../../components/PlayersGrid';

interface Props {
}

function findFirstQuestion(questions: Question[]) {
  return questions.find((q) => !q.is);
}

function findNextPlayer(players: { player: Player }[], currentPlayer: Player): Player {
  const idx = players.findIndex((p) => p.player === currentPlayer);

  return players[(idx + 1) % players.length].player;
}

const questionsData: Question[] = [
  {
    id: '01',
    text: 'Что присвоится в переменную `$N` в **`PHP`**?  \n `$arr = [1,2,3];`  \n `$n = $arr[100500];`',
    variants: [
      { label: '`null`' },
      { label: '*Пустая строка*' },
    ],
    answer: '1',
    is: false,
  },
  {
    id: '02',
    text: `Что присвоится в переменную \`$N\` в **\`PHP\`**?`,
    variants: [],
    answer: 'А вот подумай сам',
    is: false,
  },
];

const playersData = [
  {
    player: { id: 0, name: 'Лиза Кудроу' } as Player,
    status: {} as PlayerGameStatus,
  },
  {
    player: { id: 1, name: 'Юрий Дудь' } as Player,
    status: {} as PlayerGameStatus,
  },
  {
    player: { id: 2, name: 'Илон Маск' } as Player,
    status: {} as PlayerGameStatus,
  },
  {
    player: { id: 3, name: 'Иван Дорн' } as Player,
    status: {} as PlayerGameStatus,
  },
  {
    player: { id: 4, name: 'Билли Айлиш' } as Player,
    status: {} as PlayerGameStatus,
    isOut: true,
  },
  {
    player: { id: 5, name: 'Павел Дуров' } as Player,
    status: {} as PlayerGameStatus,
  },
];

const GameRound: FC<Props> = () => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  return <>
    {currentQuestion ? <div className="absolute inset-0 z-[100]">
      <QuestionCard
        question={currentQuestion} player={currentPlayer} role={Role.Admin}
        onVerdict={(value) => {
          console.log('On onVerdict', value);
          currentQuestion.is = true;
          setCurrentPlayer(findNextPlayer(playersData, currentPlayer));
          setCurrentQuestion(null);
        }}
        onClose={() => {
          console.log('Close Question', currentQuestion.text);
          setCurrentQuestion(null);
        }}
      />
    </div> : null}
    <PlayersGrid players={playersData} currentPlayer={currentPlayer} onPlayerClick={(player) => {
      setCurrentPlayer(player);
      setCurrentQuestion(findFirstQuestion(questionsData));
    }} />
  </>;
};

export {
  GameRound,
};
