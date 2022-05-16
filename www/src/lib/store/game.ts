import { createEffect, createEvent, createStore, Effect } from 'effector-logger';
import { AnswerQuestionRequest, Question, Round, ServerTask, User, UserRound } from '../api';
import {
  roundUpdate as roundUpdateEvent,
  question as questionEvent,
} from './serverEvents';
import { getConnectionInstance } from '../connection';
import { refresh } from './round';
import { MAX_SCORE } from '../settings';

export const players = createStore<UserRound[]>([], { name: 'Round users' });
export const currentPlayer = createStore<User['id']>(null, { name: 'Current user' });
export const bank = players.map(users => users?.reduce((total, user) => total + user.bankSum, 0) ?? 0);
bank.shortName = "Bank";

export const question = createStore<Question>(null, { name: 'Current question' });
export const chain = question.map(question => question?.rightAnswersCount ?? 0);
chain.shortName = "Chain";
export const stake = chain.map(chain => chain > 0 ? 2 ** (chain - 1) : 0);
stake.shortName = "Stake";

export const timeIsUp = createEvent('Round time is up');
export const bankFull = createEvent('Bank is full');

export const saveBank: Effect<{
  questionId: Question['id'],
  sum: number,
  userId: User['id'],
  roundId: Round['id'],
}, void> = createEffect('Save to bank');
export const answerQuestion: Effect<{
  questionId: Question['id'],
  isCorrect: boolean,
  userId: User['id'],
  roundId: Round['id']
}, void> = createEffect('Answer question');

players.on(roundUpdateEvent, (prev, { users }) => users);
currentPlayer.on(roundUpdateEvent, (prev, { currentUserId }) => currentUserId);
question.on(questionEvent, (prev, next) => next);

saveBank.use(({ questionId, sum, userId, roundId }) =>
  getConnectionInstance().invoke(ServerTask.AnswerQuestion, {
    isBank: true,
    bankSum: sum,
    questionId,
    userId,
    roundId,
  } as AnswerQuestionRequest)
);

bank.watch(value => {
  if (value >= MAX_SCORE) {
    bankFull();
  }
})

answerQuestion.use(({ isCorrect, questionId, userId, roundId }) =>
  getConnectionInstance().invoke(ServerTask.AnswerQuestion, {
    isBank: false,
    questionId,
    isCorrect,
    userId,
    roundId,
  } as AnswerQuestionRequest)
);

saveBank.finally.watch(() => refresh());
answerQuestion.finally.watch(() => refresh());

