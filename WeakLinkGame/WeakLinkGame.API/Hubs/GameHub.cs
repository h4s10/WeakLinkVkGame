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
        round.CurrentUserId = userRounds.First().UserId;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await Clients.All.SendRoundState(new SendRoundStateResponse(session.Id, round.State, round.Id, (int) round.CurrentUserId,
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
        var usersLeft = await _context.UserRounds.Include(x => x.User).Where(x => x.RoundId == roundId && !x.IsWeak).Select(x => x.User)
            .ToListAsync();
        if (usersLeft.Count <= 2)
        {
            var session = await _context
                .Sessions.Where(x => x.Id == round.SessionId)
                .Include(x => x.Rounds)
                .ThenInclude(x => x.UserRounds)
                .FirstOrDefaultAsync();
            var bankSum = session.Rounds.SelectMany(x => x.UserRounds).Sum(x => x.BankSum);
            usersLeft.ForEach(x => x.Score = bankSum);
        }
        _context.Users.UpdateRange(usersLeft);
        await _context.SaveChangesAsync();
        await GetSessionState(round.SessionId);
    }

    public async Task AnswerQuestion(AnswerQuestionRequest request)
    {
        if (!request.IsBank && request.QuestionId is null)
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
        var question = await _context.Questions.Include(x => x.Answers).FirstOrDefaultAsync(x => x.Id == request.QuestionId);
        if (question is null)
        {
            _logger.LogError("Question {QuestionId} not found", request.QuestionId);
            return;
        }
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
            question.State = QuestionState.New;
            _context.Questions.Update(question);
            _context.UserRounds.Update(userRound);
            _context.Rounds.Update(round);
            await _context.SaveChangesAsync();
            await GetQuestion((int) round.CurrentUserId!, round.RightAnswerChainCount);
            return;
        }

        //Отвечаем на вопрос
        var userRounds = await _context.UserRounds.Where(x => x.RoundId == request.RoundId).ToListAsync();
        question.UserId = request.UserId;
        if (!request.IsPass)
        {
            if (request.IsCorrect)
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

        round.CurrentUserId = userRounds.GetNext(userRound).UserId;
        _context.Questions.Update(question);
        _context.UserRounds.Update(userRound);
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await GetQuestion((int) round.CurrentUserId, round.RightAnswerChainCount);
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
        
        await Clients.All.SendSessionState(session.Rounds.Select(x => new RoundDto()
        {
            Id = x.Id,
            State = x.State
        }), session.CurrentRoundId);
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
        
        await Clients.All.SendRoundState(new SendRoundStateResponse(round.SessionId, round.State, roundId, round.CurrentUserId,
            userRounds.Select(x => new UserRoundDto()
            {
                BankSum = x.BankSum,
                Id = x.UserId,
                IsWeak = x.IsWeak,
                Name = x.User.Name,
                PassCount = x.WrongScore,
                RightCount = x.RightScore,
                Score = x.User.Score,
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

        var previousRoundId = session.CurrentRoundId;
        var round = new Round(session.Id);
        await _context.Rounds.AddAsync(round);
        await _context.SaveChangesAsync();
        
        if (previousRoundId is not null)
        {
            var previousUserRounds = await _context.UserRounds.Where(x => x.RoundId == previousRoundId && !x.IsWeak).ToListAsync();
            var userRounds = previousUserRounds.Select(x => new UserRound(round.Id, x.UserId));
            await _context.UserRounds.AddRangeAsync(userRounds);
            round.CurrentUserId = userRounds.First().UserId;
            _context.Rounds.Update(round);
        }

        session.CurrentRoundId = round.Id;
        _context.Sessions.Update(session);
        await _context.SaveChangesAsync();
        await GetSessionState(sessionId);
        await StartRound(round.Id);
    }

    public async Task GetQuestion(int currentUserId, int rightAnswersCount)
    {
        var question = await _context.Questions.Where(x => x.State == QuestionState.New)
            .Include(x => x.Answers)
            .FirstOrDefaultAsync();
        
        if (question is null)
        {
            var errorText = "No available questions in DB with state New";
            _logger.LogError(errorText);
            await Clients.All.Error(errorText);
            return;
        }

        question.State = QuestionState.NotAnswered;
        _context.Questions.Update(question);
        await _context.SaveChangesAsync();
        var answers = question.Answers!.Select(x => new AnswerDto()
        {
            Id = x.Id,
            IsCorrect = x.IsCorrect,
            Text = x.Text,
        });
        await Clients.All.SendQuestion(new QuestionResponse(question.Id, question.Text, currentUserId, rightAnswersCount, answers));
    }

    public async Task ChangeCurrentUser(int userId, int roundId)
    {
        var round = await _context.Rounds.FindAsync(roundId);
        if (round is null)
        {
            _logger.LogError("Round {RoundId} not found", roundId);
            return;
        }

        var user = await _context.UserRounds.FirstOrDefaultAsync(x => x.UserId == userId && x.RoundId == roundId);
        if (user is null)
        {
            var errorText = "User is not found in that round";
            _logger.LogError(errorText);
            await Clients.All.Error(errorText);
            return;
        }

        round.CurrentUserId = userId;
        _context.Rounds.Update(round);
        await _context.SaveChangesAsync();
        await GetQuestion(userId, round.RightAnswerChainCount);
    }
}