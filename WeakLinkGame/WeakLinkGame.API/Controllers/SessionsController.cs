using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer;
using WeakLinkGame.DataContracts.Responses;

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
    public async Task<ActionResult<IEnumerable<GetSessionsResponse>>> GetSessions()
    {
        var result = await _context.Sessions.Select(x => new GetSessionsResponse(){Id = x.Id, Name = x.Name}).ToListAsync();
        return Ok(result);
    }
}