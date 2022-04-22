namespace WeakLinkGame.API.Interfaces;

public interface IGameClient
{
    Task PrepareSession(int sessionId);
}