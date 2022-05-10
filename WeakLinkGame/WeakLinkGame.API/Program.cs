using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer;
using Serilog;
using WeakLinkGame.API.Hubs;
using ILogger = Serilog.ILogger;

var builder = WebApplication.CreateBuilder(args);
var dbPath = Path.Join(AppDomain.CurrentDomain.BaseDirectory, builder.Configuration.GetSection("DbFilePath").Value);
builder.Services.AddDbContext<WLGDbDataContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));
builder.Logging.ClearProviders();
ILogger logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
builder.Logging.AddSerilog(logger);
builder.Services.AddSingleton(logger);
// Add services to the container.
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