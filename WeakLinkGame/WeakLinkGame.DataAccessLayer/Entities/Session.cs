namespace WeakLinkGame.DataAccessLayer.Entities;

public class Session
{
    public Session()
    { }
    
    public int Id { get; set; }

    public int? CurrentRoundId { get; set; }
    public Round? CurrentRound { get; set; }

    public List<Round> Rounds { get; set; }
}