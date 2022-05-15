namespace WeakLinkGame.DataAccessLayer.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int? CurrentRoundId { get; set; }
    public Round? CurrentRound { get; set; }

    public List<UserRound>? UserRounds { get; set; }
    public List<Question>? Questions { get; set; }
}