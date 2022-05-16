using WeakLinkGame.DataContracts.Responses;

namespace WeakLinkGame.API.Interfaces;

public interface IGameClient
{
    Task SendRoundState(SendRoundStateResponse response);
    Task SendSessionState(IEnumerable<int> response, int? currentRoundId);
    Task SendQuestion(QuestionResponse response);
    Task Error(string text);
}