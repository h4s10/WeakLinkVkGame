export enum GameState {
  Unauthorized = 'Unauthorized',
  SessionSelect = 'SessionSelect',
  Round = 'Round',
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
