namespace WeakLinkGame.DataContracts.Requests;

public class CreateSessionRequest
{
    public IEnumerable<int> UserIds { get; set; }
}