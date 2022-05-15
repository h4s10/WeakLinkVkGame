import { createEvent } from 'effector-logger';
import { ClientTask, Question, Round, RoundState as ServerRoundState } from '../api';
import { connectionEstablished, getConnectionInstance } from '../connection';

export const sessionUpdate = createEvent<{ rounds: Round['id'][], current?: Round['id'] }>({ name: 'Server sent session update' });
export const roundUpdate = createEvent<ServerRoundState>({ name: 'Server sent round update' });
export const question = createEvent<Question>({ name: 'Server sent round update' });

connectionEstablished.watch(() => {
  getConnectionInstance().on(ClientTask.SendSessionState, (rounds, current) => sessionUpdate({ rounds, current }));
  getConnectionInstance().on(ClientTask.SendRoundState, roundUpdate);
  getConnectionInstance().on(ClientTask.SendQuestion, question);
});
