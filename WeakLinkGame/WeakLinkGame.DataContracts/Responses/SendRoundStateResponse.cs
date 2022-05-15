using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public record SendRoundStateResponse(int SessionId, IEnumerable<UserRoundDto> Users);