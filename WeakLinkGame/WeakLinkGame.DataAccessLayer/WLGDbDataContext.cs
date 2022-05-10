using Microsoft.EntityFrameworkCore;
using WeakLinkGame.DataAccessLayer.Entities;

namespace WeakLinkGame.DataAccessLayer;

public class WLGDbDataContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Round> Rounds { get; set; }
    public DbSet<UserRound> UserRounds { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    
    public WLGDbDataContext(DbContextOptions<WLGDbDataContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Name).IsUnique();
        
        modelBuilder.Entity<Round>()
            .HasOne(x => x.Session)
            .WithMany(x => x.Rounds)
            .HasForeignKey(x => x.SessionId);
        
        modelBuilder.Entity<Session>()
            .HasOne(x => x.CurrentRound)
            .WithOne(x => x.CurrentSession)
            .HasForeignKey<Session>(x => x.CurrentRoundId);
        
        modelBuilder.Entity<UserRound>()
            .HasOne(x => x.User)
            .WithMany(x => x.UserRounds)
            .HasForeignKey(x => x.UserId);
        modelBuilder.Entity<UserRound>()
            .HasOne(x => x.Round)
            .WithMany(x => x.UserRounds)
            .HasForeignKey(x => x.RoundId);
        modelBuilder.Entity<Question>()
            .HasOne(x => x.User)
            .WithMany(x => x.Questions)
            .HasForeignKey(x => x.UserId);
        modelBuilder.Entity<Answer>()
            .HasOne(x => x.Question)
            .WithMany(x => x.Answers)
            .HasForeignKey(x => x.QuestionId);
    }
}