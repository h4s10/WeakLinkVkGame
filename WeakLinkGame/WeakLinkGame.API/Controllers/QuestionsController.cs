using Microsoft.AspNetCore.Mvc;
using WeakLinkGame.API.Services;
using WeakLinkGame.DataAccessLayer;

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
}