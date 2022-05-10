namespace WeakLinkGame.DataContracts.DTO;

public class UserRoundDto
{
    public string Name { get; set; }
    public int Id { get; set; }
    public int PassCount { get; set; }
    public int RightCount { get; set; }
    public int BankSum { get; set; }
    public bool IsWeak { get; set; }
}