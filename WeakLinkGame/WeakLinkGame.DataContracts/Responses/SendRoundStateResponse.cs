using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public class SendRoundStateResponse
{
    public IEnumerable<UserRoundDto> Users { get; set; }
}