using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public record QuestionResponse(int Id, string Text, IEnumerable<AnswerDto> Answers);