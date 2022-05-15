using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public record SendRoundStateResponse(int SessionId, int RoundId, int? CurrentUserId, IEnumerable<UserRoundDto> Users);