// События/методы которые бэк вызывает у клиента
// См /WeakLinkGame/WeakLinkGame.API/Interfaces/IGameClient.cs
export enum ClientTask {
  PrepareSession = 'PrepareSession'
}

// События/методы которые клиенты вызывает у сервера
// См WeakLinkGame/WeakLinkGame.API/Hubs/GameHub.cs
export enum ServerTask {
  Join = 'Join',
  Leave = 'Leave',
  CreateSession = 'CreateSession',
}

export const HUB_URL = 'https://localhost:7089/game';

