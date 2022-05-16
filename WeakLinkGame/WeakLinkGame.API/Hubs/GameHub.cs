using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Utils.Extensions;
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
    public GameHub(WLGDbDataContext context, ILogger<GameHub> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    private readonly WLGDbDataContext _context;
    private readonly ILogger<GameHub> _logger;

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
        round.CurrentUserId = userRounds.First().Id;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await Clients.Group(UserGroup.Player).SendRoundState(new SendRoundStateResponse(session.Id, round.Id, (int) round.CurrentUserId,
            userRounds.Select(x => new UserRoundDto()
            {
                BankSum = x.BankSum,
                Id = x.UserId,
                IsWeak = x.IsWeak,
                Name = x.User.Name,
                PassCount = x.User.Questions?.Count(question => question.State == QuestionState.Passed) ?? 0,
                RightCount = x.User.Questions?.Count(question => question.State == QuestionState.Answered) ?? 0
            }))
        );
    }
    
    public async Task EndRound(int roundId, int weakUserId)
    {
        var round = await _context.Rounds.Include(x => x.UserRounds).FirstOrDefaultAsync(x => x.Id == roundId);
        if (round is null)
        {
            _logger.LogError("Round {RoundId} not found", roundId);
            return;
        }
        
        round.State = RoundState.Ended;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();

        var userRound = round.UserRounds.FirstOrDefault(x => x.UserId == weakUserId);
        if (userRound is null)
        {
            _logger.LogError("UserRound with user {UserId} and round {RoundId} not found", weakUserId, roundId);
            return;
        }

        userRound.IsWeak = true;
        _context.UserRounds.Update(userRound);
        await _context.SaveChangesAsync();
    }

    public async Task AnswerQuestion(AnswerQuestionRequest request)
    {
        if (!request.IsBank && (request.AnswerId is null || request.QuestionId is null))
        {
            _logger.LogError("Wrong parameters!");
            return;
        }
        
        var userRound = await _context.UserRounds.FirstOrDefaultAsync(x => x.UserId == request.UserId && x.RoundId == request.RoundId);
        if (userRound is null)
        {
            _logger.LogError("UserRound with user {UserId} and round {RoundId} not found", request.UserId, request.RoundId);
            return;
        }

        var round = await _context.Rounds.FindAsync(request.RoundId);
        //Кладем в банк
        if (request.IsBank)
        {
            if (request.BankSum is null or < 0)
            {
                _logger.LogError("Wrong bankSum parameter!");
                return;
            }

            userRound.BankSum += (int) request.BankSum;
            round.RightAnswerChainCount = 0;
            _context.UserRounds.Update(userRound);
            _context.Rounds.Update(round);
            await _context.SaveChangesAsync();
            return;
        }

        //Отвечаем на вопрос
        var userRounds = await _context.UserRounds.Where(x => x.RoundId == request.RoundId).ToListAsync();
        var question = await _context.Questions.Include(x => x.Answers).FirstOrDefaultAsync(x => x.Id == request.QuestionId);
        if (question is null)
        {
            _logger.LogError("Question {QuestionId} not found", request.QuestionId);
            return;
        }

        question.UserId = request.UserId;
        if (!request.IsPass)
        {
            var answer = question.Answers!.FirstOrDefault(x => x.Id == request.AnswerId);
            if (answer is null)
            {
                _logger.LogError("Answer {AnswerId} not found", request.AnswerId);
                return;
            }

            if (answer.IsCorrect)
            {
                userRound.RightScore += 1;
                round.RightAnswerChainCount++;
            }
            else
            {
                userRound.WrongScore += 1;
                round.RightAnswerChainCount = 0;
            }

            question.State = QuestionState.Answered;
        }
        else
        {
            userRound.WrongScore += 1;
            round.RightAnswerChainCount = 0;
            question.State = QuestionState.Passed;
        }

        _context.Questions.Update(question);
        _context.UserRounds.Update(userRound);
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await GetQuestion(userRounds.GetNext(userRound).UserId, round.RightAnswerChainCount);
    }

    public async Task GetSessionState(int idSession)
    {
        var session = await _context
            .Sessions.Where(x => x.Id == idSession)
            .Include(x => x.Rounds)
            .FirstOrDefaultAsync();
        if (session is null)
        {
            _logger.LogError("Session {SessionId} not found", idSession);
            return;
        }
        
        await Clients.All.SendSessionState(session.Rounds.Select(x => x.Id), session.CurrentRoundId);
    }
    
    public async Task GetRoundState(int roundId)
    {
        var userRounds = await _context.UserRounds.Where(x => x.RoundId == roundId)
            .Include(x => x.User)
            .ThenInclude(x => x.Questions)
            .ToListAsync();
        var round = await _context.Rounds.FindAsync(roundId);
        if (round is null)
        {
            _logger.LogError("Round {RoundId} not found", roundId);
            return;
        }
        
        await Clients.All.SendRoundState(new SendRoundStateResponse(round.SessionId, roundId, round.CurrentUserId,
            userRounds.Select(x => new UserRoundDto()
            {
                BankSum = x.BankSum,
                Id = x.UserId,
                IsWeak = x.IsWeak,
                Name = x.User.Name,
                PassCount = x.User.Questions?.Count(question => question.State == QuestionState.Passed) ?? 0,
                RightCount = x.User.Questions?.Count(question => question.State == QuestionState.Answered) ?? 0
            }))
        );
    }

    public async Task StartRound(int roundId)
    {
        var round = await _context.Rounds.FirstOrDefaultAsync(x => x.Id == roundId);
        if (round is null)
        {
            _logger.LogError("Round {RoundId} not found", roundId);
            return;
        }
        
        round.StartTime = DateTime.Now;
        round.State = RoundState.Started;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await GetQuestion((int) round.CurrentUserId, 0);
    }

    public async Task CreateRound(int sessionId)
    {
        var session = await _context.Sessions.FirstOrDefaultAsync(x => x.Id == sessionId);
        if (session is null)
        {
            _logger.LogError("Session {SessionId} not found", sessionId);
            return;
        }
        
        var round = new Round(session.Id);
        await _context.Rounds.AddAsync(round);
        await _context.SaveChangesAsync();

        session.CurrentRoundId = round.Id;
        _context.Sessions.Update(session);
        await _context.SaveChangesAsync();
        await StartRound(round.Id);
    }

    public async Task GetQuestion(int currentUserId, int rightAnswersCount)
    {
        var question = await _context.Questions.Where(x => x.State == QuestionState.New)
            .Include(x => x.Answers)
            .FirstOrDefaultAsync();
        if (question is null)
        {
            _logger.LogError("No available questions in DB with state New");
            return;
        }

        await Clients.All.SendQuestion(new QuestionResponse(question.Id, question.Text, currentUserId, rightAnswersCount, question.Answers!.Select(x => new AnswerDto()
        {
            Id = x.Id,
            IsCorrect = x.IsCorrect,
            Text = x.Text,
        })));
    }
}