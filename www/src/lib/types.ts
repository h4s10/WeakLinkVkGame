import { PlayerReputation } from './constants';

export type Timestamp = number;
export type Seconds = number;
export type Milliseconds = number;

export interface Player {
  id: string|number;
  name: string;
  avatar?: string;
}

export interface PlayerGameStatus {
  statuses: Record<PlayerReputation, number>;
  lastAction: PlayerReputation;
}

export interface Bank {
  amount: number;
}

export interface Round {
  index: number;
  roundEndTime: Timestamp;
  roundBank: number;
}

export interface Question {
  id: string|number;
  text: string,
  variants: { label: string }[],
  answer: string,
  is: boolean,
}
