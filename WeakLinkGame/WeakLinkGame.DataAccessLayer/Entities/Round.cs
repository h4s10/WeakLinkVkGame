using WeakLinkGame.DataAccessLayer.Dictionaries;

namespace WeakLinkGame.DataAccessLayer.Entities;

public class Round
{
    public Round(int sessionId)
    {
        SessionId = sessionId;
    }
    
    public int Id { get; set; }
    public DateTime? StartTime { get; set; }
    public RoundState State { get; set; } = RoundState.New;
    public int RightAnswerChainCount { get; set; }
    public int SessionId { get; set; }
    public Session Session { get; set; }
    public int? CurrentUserId { get; set; }
    public User? CurrentUser { get; set; }
    
    /// <summary>
    /// Сессия в которой этот раунд является текущим
    /// </summary>
    public Session? CurrentSession { get; set; }
    public List<UserRound> UserRounds { get; set; }
}