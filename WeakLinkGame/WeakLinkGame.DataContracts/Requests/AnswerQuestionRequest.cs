namespace WeakLinkGame.DataContracts.Requests;

public class AnswerQuestionRequest
{
    public bool IsPass { get; set; }
    public bool IsBank { get; set; }
    public int? BankSum { get; set; }
    public int? QuestionId { get; set; }
    public bool IsCorrect { get; set; }
    public int UserId { get; set; }
    public int RoundId { get; set; }
}