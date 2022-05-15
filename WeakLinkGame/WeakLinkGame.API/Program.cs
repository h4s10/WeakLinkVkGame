using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer;
using Serilog;
using WeakLinkGame.API.Hubs;
using WeakLinkGame.API.Services;
using ILogger = Serilog.ILogger;

var builder = WebApplication.CreateBuilder(args);
var dbPath = string.Empty;
#if DEBUG
    dbPath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, builder.Configuration.GetSection("DbFilePath").Value);
#else
    dbPath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, "db/" + builder.Configuration.GetSection("DbFilePath").Value);
#endif
builder.Services.AddDbContext<WLGDbDataContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));
builder.Logging.ClearProviders();
ILogger logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
builder.Logging.AddSerilog(logger);
builder.Services.AddSingleton(logger);
// Add services to the container.
builder.Services.AddTransient<IQuestionParser, QuestionParser>();
builder.Services.AddSignalR();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
            builder.WithOrigins(new[] {"http://localhost:8000", "https://localhost:8000"})
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .SetIsOriginAllowed((host) => true) //for signalr cors  
    );
});
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WLGDbDataContext>();
    var isQuestionsExists = context.Questions.Any();
    if (!isQuestionsExists)
    {
        var parser = scope.ServiceProvider.GetRequiredService<IQuestionParser>();
        var questionFilePath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, builder.Configuration.GetSection("QuestionsFilePath").Value);
        var questions = parser.Parse(questionFilePath);
        context.Questions.AddRangeAsync(questions);
        context.SaveChangesAsync();
    }
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowOrigin");
app.MapHub<GameHub>("/game");
app.Run();