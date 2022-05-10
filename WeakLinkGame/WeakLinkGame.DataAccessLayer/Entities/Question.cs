using WeakLinkGame.DataAccessLayer.Dictionaries;

namespace WeakLinkGame.DataAccessLayer.Entities;

public class Question
{
    public int Id { get; set; }
    public QuestionState State { get; set; }
    public QuestionLevel Level { get; set; }
    public string Text { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public List<Answer>? Answers { get; set; }
}