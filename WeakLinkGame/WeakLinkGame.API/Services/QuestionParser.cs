using System.Text.RegularExpressions;
using WeakLinkGame.DataAccessLayer.Entities;

namespace WeakLinkGame.API.Services;

public class QuestionParser : IQuestionParser
{
    public IEnumerable<Question> Parse(string filePath)
    {
        var lines = File.ReadAllLines(filePath);
        var result = new List<Question>();
        var question = new Question() {Answers = new List<Answer>()};
        var isNewQuestion = true;
        var answerRegex = new Regex(@"\d\)");
        for (var index = 0; index < lines.Length; index++)
        {
            var line = lines[index];
            if (isNewQuestion)
            {
                if (line.StartsWith('(')) //ignore question level
                    continue;
                
                question.Text += "  \n" + line;
                if (index + 1 <= lines.Length && answerRegex.IsMatch(lines[index + 1]))
                    isNewQuestion = false;
                continue;
            }

            if (line == string.Empty)
            {
                isNewQuestion = true;
                question.Text = question.Text.TrimStart();
                result.Add(question);
                question = new Question() {Answers = new List<Answer>()};
                continue;
            }

            if (answerRegex.IsMatch(line))
            {
                var answer = new Answer();
                answer.IsCorrect = line.Contains("(*)");
                answer.Text = answer.IsCorrect ? line.Substring(7) : line.Substring(3);
                question.Answers.Add(answer);
            }
        }

        return result;
    }
}