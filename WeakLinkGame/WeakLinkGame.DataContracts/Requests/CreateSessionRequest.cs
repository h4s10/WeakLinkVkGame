namespace WeakLinkGame.DataContracts.Requests;

public class CreateSessionRequest
{
    public string SessionName { get; set; }
    public IEnumerable<int> UserIds { get; set; }
}