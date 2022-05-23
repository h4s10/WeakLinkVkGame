export enum GameState {
  Unauthorized = 'Unauthorized',
  SessionSelect = 'SessionSelect',
  ReadyToPlay = 'ReadyToPlay',
  Round = 'Round',
  Ended = 'Ended',
}

export enum RoundState {
  Unstarted = 'Unstarted',
  Playing = 'Playing',
  Ended = 'Ended',
}

export enum Role {
  Admin = 'Admin',
  Player = 'Player'
}

export enum Authentication {
  None = 'None',
  Pending = 'Pending',
  Authenticated = 'Authenticated',
}

export enum PlayerReputation {
  BankSaver = 'bank-saver', // Больше всего положил в банк
  Wasserman = 'wasserman', // Больше всего правильных ответов
  Blondy = 'blondy' // Больше всего неправильных ответов
}

export enum QuestionVerdict {
  correct = 'correct',
  incorrect = 'incorrect',
  bank = 'bank'
}
