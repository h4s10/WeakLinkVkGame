export enum GameState {
  Unauthorized = 'Unauthorized',
  Unstarted = 'Unstarted',
  Round = 'Round',
  RoundEnded = 'RoundEnded',
}

export enum Role {
  Admin = 'admin',
  Player = 'player'
}

export enum Authentication {
  None = 'None',
  Pending = 'Pending',
  Authenticated = 'Authenticated',
}
