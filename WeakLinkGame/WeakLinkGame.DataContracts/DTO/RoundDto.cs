using WeakLinkGame.DataAccessLayer.Dictionaries;

namespace WeakLinkGame.DataContracts.DTO;

public class RoundDto
{
    public int Id { get; set; }
    public RoundState State { get; set; }
}