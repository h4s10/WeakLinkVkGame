using WeakLinkGame.DataContracts.DTO;

namespace WeakLinkGame.DataContracts.Responses;

public record QuestionResponse(int Id, string Text, int CurrentUserId, int RightAnswersCount, IEnumerable<AnswerDto> Answers);