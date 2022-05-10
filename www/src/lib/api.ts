import { Role } from './constants';

export const SERVER_HOST = 'http://localhost:7089';
export const SIGNAL_R_HUB = '/game';

// События/методы которые бэк вызывает у клиента
// См /WeakLinkGame/WeakLinkGame.API/Interfaces/IGameClient.cs
export enum ClientTask {
  SendRoundState = 'SendRoundState',
  SendSessionState = 'SendSessionState',
}

// События/методы которые клиенты вызывает у сервера
// См WeakLinkGame/WeakLinkGame.API/Hubs/GameHub.cs
export enum ServerTask {
  Join = 'Join',
  Leave = 'Leave',
  JoinSession = 'JoinSession',
  CreateSession = 'CreateSession',
  GetSessionState = 'GetSessionState',
  GetRoundState = 'GetRoundState',
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

export interface GetUserResponse {
  Id: number,
  Name: string,
  Role: Role,
}

export interface UserRound {
  Name: string,
  Id: number,
  PassCount: number,
  RightCount: number,
  BankSum: number,
  IsWeak: boolean,
}

export interface RoundStateResponse {
  Users: UserRound[],
}

export const request = async <Response extends unknown, Payload extends unknown> (method: 'GET' | 'POST', task: RestTask, body?: Payload): Promise<Response> => {
  const response = await fetch(new URL(task, SERVER_HOST).toString(), {
    method,
    body: JSON.stringify(body),
  });

  return response.json() as Response;
}
