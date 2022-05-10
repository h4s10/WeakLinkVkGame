using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer;

namespace WeakLinkGame.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SessionsController : ControllerBase
{
    public SessionsController(WLGDbDataContext context)
    {
        _context = context;
    }
    
    public WLGDbDataContext _context { get; set; }
    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<int>>> GeSessions()
    {
        var result = await _context.Sessions.Select(x => x.Id).ToListAsync();
        return Ok(result);
    }
}