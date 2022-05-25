import { createEvent } from 'effector-logger';
import { ClientTask, Question, Round, RoundState as ServerRoundState, ServerError } from '../api';
import { connectionEstablished, getConnectionInstance } from '../connection';

export const sessionUpdate = createEvent<{ rounds: Round['id'][], current?: Round['id'] }>({ name: 'Server sent session update' });
export const roundUpdate = createEvent<ServerRoundState>({ name: 'Server sent round update' });
export const question = createEvent<Question>({ name: 'Server sent round update' });
export const error = createEvent<ServerError | string>({ name: 'Server sent errror' });

connectionEstablished.watch(() => {
  const connection = getConnectionInstance();
  connection.on(ClientTask.SendSessionState, (rounds, current) => sessionUpdate({ rounds, current }));
  connection.on(ClientTask.SendRoundState, roundUpdate);
  connection.on(ClientTask.SendQuestion, question);
  connection.on(ClientTask.Error, error);
});
