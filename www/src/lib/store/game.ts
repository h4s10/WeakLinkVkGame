import { createEffect, createEvent, createStore, Effect } from 'effector-logger';
import { AnswerQuestionRequest, Question, Round, RoundState, ServerError, ServerTask, User, UserRound } from '../api';
import { error, question as questionEvent, roundUpdate as roundUpdateEvent } from './serverEvents';
import { getConnectionInstance } from '../connection';
import { currentRound, refresh } from './round';
import { MAX_SCORE } from '../settings';
import { active as timerActive, clear as clearTimer } from './timer';

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
export const questionsEnded = createEvent('Out of questions');

export const saveBank: Effect<{
  questionId: Question['id'],
  sum: number,
  userId: User['id'],
  roundId: Round['roundId'],
}, void> = createEffect('Save to bank');
export const answerQuestion: Effect<{
  questionId: Question['id'],
  isCorrect: boolean,
  userId: User['id'],
  roundId: Round['roundId']
}, void> = createEffect('Answer question');

players.on(roundUpdateEvent, (prev, { users, roundId }) => {
  if (roundId === currentRound.getState()) {
    return users;
  }
});
currentPlayer.on(roundUpdateEvent, (prev, { currentUserId, roundId, roundState }) => {
  if (roundId === currentRound.getState() && roundState !== RoundState.Ended) {
    return currentUserId;
  }
});
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
    clearTimer();
  }
});

timerActive.watch((active) => {
  if (!active) {
    timeIsUp();
  }
});

error.watch((error) => {
  if (error === ServerError.NO_QUESTIONS) {
    questionsEnded();
    clearTimer();
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

