using WeakLinkGame.DataAccessLayer.Dictionaries;
using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public record SendRoundStateResponse(int SessionId, RoundState RoundState, int RoundId, int? CurrentUserId, IEnumerable<UserRoundDto> Users);