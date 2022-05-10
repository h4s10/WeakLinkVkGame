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
    
    /// <summary>
    /// Сессия в которой этот раунд является текущим
    /// </summary>
    public Session? CurrentSession { get; set; }
    public List<UserRound> UserRounds { get; set; }
}