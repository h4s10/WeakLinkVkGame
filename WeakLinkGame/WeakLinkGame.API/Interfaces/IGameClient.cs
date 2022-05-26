using WeakLinkGame.DataContracts.DTO;
using WeakLinkGame.DataContracts.Responses;

namespace WeakLinkGame.API.Interfaces;

public interface IGameClient
{
    Task SendRoundState(SendRoundStateResponse response);
    Task SendSessionState(IEnumerable<RoundDto> response, int? currentRoundId);
    Task SendQuestion(QuestionResponse response);
    Task Error(string text);
}