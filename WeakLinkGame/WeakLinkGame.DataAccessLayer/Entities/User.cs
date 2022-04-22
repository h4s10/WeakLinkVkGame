namespace WeakLinkGame.DataAccessLayer.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<UserRound> UserRounds { get; set; }
}