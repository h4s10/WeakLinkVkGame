export enum GameState {
  Unauthorized = 'Unauthorized',
  Unstarted = 'Unstarted',
  Round = 'Round',
  RoundEnded = 'RoundEnded',
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

export enum AnswerColor {
  Correct = 'var(--correct-color)',
  Incorrect = 'var(--incorrect-color)',
  Neutral = 'var(--neutral-answer-color)',
}
