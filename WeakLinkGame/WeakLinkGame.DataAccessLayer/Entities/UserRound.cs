namespace WeakLinkGame.DataAccessLayer.Entities;

public class UserRound
{
    public UserRound(int roundId, int userId)
    {
        RoundId = roundId;
        UserId = userId;
    }
    
    public int Id { get; set; }

    public int RoundId { get; set; }
    public Round Round { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public int RightScore { get; set; }
    public int WrongScore { get; set; }
    public int BankSum { get; set; }
    public bool IsWeak { get; set; }
}