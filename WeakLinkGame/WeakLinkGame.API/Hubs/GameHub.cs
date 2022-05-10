using Microsoft.AspNetCore.SignalR;
using WeakLinkGame.API.Interfaces;
using WeakLinkGame.DataAccessLayer;
using WeakLinkGame.DataAccessLayer.Entities;
using WeakLinkGame.DataContracts.Dictionaries;
using WeakLinkGame.DataContracts.Requests;

namespace WeakLinkGame.API.Hubs;

public class GameHub : Hub<IGameClient>
{
    public GameHub(WLGDbDataContext context)
    {
        _context = context;
    }
    
    private readonly WLGDbDataContext _context;

    public async Task Join(string group) => await Groups.AddToGroupAsync(Context.ConnectionId, group);

    public async Task Leave(string group) => await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
    
    public async Task CreateSession(CreateSessionRequest request)
    {
        var session = new Session();
        await _context.Sessions.AddAsync(session);
        await _context.SaveChangesAsync();

        var round = new Round(session.Id);
        await _context.Rounds.AddAsync(round);
        await _context.SaveChangesAsync();
        
        var userRounds = request.UserIds.Select(x => new UserRound(round.Id, x));
        await _context.UserRounds.AddRangeAsync(userRounds);
        await _context.SaveChangesAsync();
        await Clients.Group(UserGroup.Player).PrepareSession(session.Id);
    }
}