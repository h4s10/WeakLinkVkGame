export type Timestamp = number;
export type Seconds = number;
export type Milliseconds = number;

export enum PlayerReputation {
  BankSaver = 'bank-saver', // Больше всего положил в банк
  Wasserman = 'wasserman', // Больше всего правильных ответов
  Blondy = 'blondy' // Больше всего неправильных ответов
}

export interface Player {
  id: string;
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
