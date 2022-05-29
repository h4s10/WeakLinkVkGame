using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeakLinkGame.API.Services;
using WeakLinkGame.DataAccessLayer;
using WeakLinkGame.DataAccessLayer.Dictionaries;

namespace WeakLinkGame.API.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionsController : ControllerBase
{
    public QuestionsController(WLGDbDataContext context)
    {
        _context = context;
    }

    public WLGDbDataContext _context { get; set; }

    [HttpPost]
    public async Task<IActionResult> Add([FromForm]IFormFile file, [FromServices]IQuestionParser parser)
    {
        var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory  + file.FileName);
        await using (var fileStream = new FileStream(path, FileMode.Create))
            await file.CopyToAsync(fileStream);

        var questions = parser.Parse(path);
        await _context.Questions.AddRangeAsync(questions);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question is null)
            return Ok();
        
        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();
        return Ok();
    }
    
    [HttpDelete("noanswer")]
    public async Task<IActionResult> DeleteNew()
    {
        var questions = await _context.Questions.Where(x => x.State == QuestionState.New).ToListAsync();
        if (!questions.Any())
            return Ok();
        
        _context.Questions.RemoveRange(questions);
        await _context.SaveChangesAsync();
        return Ok();
    }
    
    [HttpGet("count")]
    public async Task<IActionResult> Count()
    {
        var questions = await _context.Questions.ToListAsync();
        if (questions.Any())
            return Ok();
        
        return Ok(new
        {
            New = questions.Count(x => x.State == QuestionState.New),
            NotAnswered = questions.Count(x => x.State != QuestionState.New)
        });
    }
}