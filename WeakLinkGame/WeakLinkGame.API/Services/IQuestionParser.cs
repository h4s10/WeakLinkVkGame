using WeakLinkGame.DataAccessLayer.Entities;

namespace WeakLinkGame.API.Services;

public interface IQuestionParser
{
    IEnumerable<Question> Parse(string filePath);
}