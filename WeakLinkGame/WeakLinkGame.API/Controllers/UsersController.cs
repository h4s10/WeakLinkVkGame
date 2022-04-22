using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer;
using WeakLinkGame.DataAccessLayer.Entities;
using WeakLinkGame.DataContracts.Requests;
using WeakLinkGame.DataContracts.Responses;

namespace WeakLinkGame.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    public UsersController(WLGDbDataContext context)
    {
        _context = context;
    }

    public WLGDbDataContext _context { get; set; }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest item)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        await _context.Users.AddAsync(new User() {Name = item.Name});
        await _context.SaveChangesAsync();
        return Ok();
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetUserResponse>>> GetUsers()
    {
        var result = await _context.Users.Select(u => new GetUserResponse() {Id = u.Id, Name = u.Name}).ToListAsync();
        return Ok(result);
    }
}