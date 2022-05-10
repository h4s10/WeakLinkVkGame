using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public class QuestionResponse
{
    public string Text { get; set; }
    public int Id { get; set; }
    public IEnumerable<AnswerDto> Answers { get; set; }
}