import { Role } from './constants';
import { SERVER_URL } from './settings';

// События/методы которые бэк вызывает у клиента
// См /WeakLinkGame/WeakLinkGame.API/Interfaces/IGameClient.cs
export enum ClientTask {
  SendRoundState = 'SendRoundState',
  SendSessionState = 'SendSessionState',
  SendQuestion = 'SendQuestion',
  Error = 'SendQuestion',
}

// События/методы которые клиенты вызывает у сервера
// См WeakLinkGame/WeakLinkGame.API/Hubs/GameHub.cs
export enum ServerTask {
  Join = 'Join',
  Leave = 'Leave',
  CreateSession = 'CreateSession',
  GetSessionState = 'GetSessionState',
  GetRoundState = 'GetRoundState',
  CreateRound = 'CreateRound',
  StartRound = 'StartRound',
  EndRound = 'EndRound',
  GetQuestion = 'GetQuestion',
  AnswerQuestion = 'AnswerQuestion',
}

export enum RestTask {
  Users = 'users',
  Sessions = 'sessions',
}

export interface Session {
  id: number,
  name: string,
}

export interface CreateUserRequest {
  Name: string,
}

export interface CreateSessionRequest {
  SessionName: string,
  UserIds: number[],
}

export interface User {
  id: number,
  name: string,
  role: Role,
}

export interface Round {
  id: number,
}

export interface UserRound {
  name: string,
  id: number,
  passCount: number,
  rightCount: number,
  bankSum: number,
  isWeak: boolean,
}

export interface RoundState {
  sessionId: Session['id'],
  roundId: Round['id'],
  currentUserId: User['id'],
  users: UserRound[],
}

export interface Answer {
  id: number,
  text: string,
  isCorrect: boolean
}

export interface Question {
  id: number,
  text: string,
  currentUserId: User['id'],
  rightAnswersCount: number,
  answers: Answer[],
}

export interface AnswerQuestionRequest {
  isBank: boolean,
  bankSum?: number,
  questionId?: Question['id'],
  isCorrect: boolean,
  userId: User['id'],
  roundId: Round['id'],
}

export enum ServerError {
  NO_QUESTIONS = 'No available questions in DB with state New',
}

export const request = async <Response extends unknown, Payload extends unknown> (method: 'GET' | 'POST', task: RestTask, body?: Payload): Promise<Response> => {
  const response = await fetch(new URL(task, SERVER_URL).toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json() as Response;
}
