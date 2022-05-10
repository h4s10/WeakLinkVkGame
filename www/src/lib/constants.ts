export enum GameState {
  Unauthorized = 'Unauthorized',
  SessionSelect = 'SessionSelect',
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
