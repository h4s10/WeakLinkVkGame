using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WeakLinkGame.API.Interfaces;
using WeakLinkGame.DataAccessLayer;
using WeakLinkGame.DataAccessLayer.Dictionaries;
using WeakLinkGame.DataAccessLayer.Entities;
using WeakLinkGame.DataContracts.Dictionaries;
using WeakLinkGame.DataContracts.DTO;
using WeakLinkGame.DataContracts.Requests;
using WeakLinkGame.DataContracts.Responses;

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
        var session = new Session(){Name = request.SessionName};
        await _context.Sessions.AddAsync(session);
        await _context.SaveChangesAsync();

        var round = new Round(session.Id);
        await _context.Rounds.AddAsync(round);
        await _context.SaveChangesAsync();

        session.CurrentRoundId = round.Id;
        _context.Sessions.Update(session);
        await _context.SaveChangesAsync();
        
        var userRounds = request.UserIds.Select(x => new UserRound(round.Id, x));
        await _context.UserRounds.AddRangeAsync(userRounds);
        await _context.SaveChangesAsync();

        userRounds = await _context.UserRounds.Where(x => x.RoundId == round.Id)
            .Include(x => x.User)
            .ThenInclude(x => x.Questions)
            .ToListAsync();
        await Clients.Group(UserGroup.Player).SendRoundState(new SendRoundStateResponse()
        {
            Users = userRounds.Select(x => new UserRoundDto()
            {
                BankSum = x.BankSum,
                Id = x.UserId,
                IsWeak = x.IsWeak,
                Name = x.User.Name,
                PassCount = x.User.Questions?.Count(question => question.State == QuestionState.Passed) ?? 0,
                RightCount = x.User.Questions?.Count(question => question.State == QuestionState.Answered) ?? 0
            })
        });
    }

    public async Task GetSessionState(int idSession)
    {
        var session = await _context
            .Sessions.Where(x => x.Id == idSession)
            .Include(x => x.Rounds)
            .FirstOrDefaultAsync();
        await Clients.All.SendSessionState(session.Rounds.Select(x => x.Id), session.CurrentRoundId);
    }
    
    public async Task GetRoundState(int roundId)
    {
        var userRounds = await _context.UserRounds.Where(x => x.RoundId == roundId)
            .Include(x => x.User)
            .ThenInclude(x => x.Questions)
            .ToListAsync();
        await Clients.Group(UserGroup.Player).SendRoundState(new SendRoundStateResponse()
        {
            Users = userRounds.Select(x => new UserRoundDto()
            {
                BankSum = x.BankSum,
                Id = x.UserId,
                IsWeak = x.IsWeak,
                Name = x.User.Name,
                PassCount = x.User.Questions?.Count(question => question.State == QuestionState.Passed) ?? 0,
                RightCount = x.User.Questions?.Count(question => question.State == QuestionState.Answered) ?? 0
            })
        });
    }

    public async Task StartRound(int roundId)
    {
        var round = await _context.Rounds.FirstOrDefaultAsync(x => x.Id == roundId);
        round.StartTime = DateTime.Now;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await GetQuestion(QuestionLevel.Easy);
    }

    public async Task CreateRound(int sessionId)
    {
        var session = await _context.Sessions.FirstOrDefaultAsync(x => x.Id == sessionId);
        var round = new Round(session.Id);
        await _context.Rounds.AddAsync(round);
        await _context.SaveChangesAsync();

        session.CurrentRoundId = round.Id;
        _context.Sessions.Update(session);
        await _context.SaveChangesAsync();
        await StartRound(round.Id);
    }

    public async Task GetQuestion(QuestionLevel level)
    {
        var question = await _context.Questions.Where(x => x.State == QuestionState.New && x.Level == level)
            .Include(x => x.Answers)
            .FirstOrDefaultAsync();
        if (question is null)
            return;
        
        await Clients.All.SendQuestion(new QuestionResponse()
        {
            Id = question.Id,
            Text = question.Text,
            Answers = question.Answers.Select(x => new AnswerDto()
            {
                Id = x.Id,
                IsCorrect = x.IsCorrect,
                Text = x.Text,
            })
        });
    }
}