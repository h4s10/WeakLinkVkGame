namespace WeakLinkGame.DataAccessLayer.Entities;

public class Round
{
    public Round(int sessionId)
    {
        SessionId = sessionId;
    }
    
    public int Id { get; set; }
    public DateTime? StartTime { get; set; }

    public int SessionId { get; set; }
    public Session Session { get; set; }
    
    public Session? CurrentSession { get; set; }
    public List<UserRound> UserRounds { get; set; }
}