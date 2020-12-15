using Microsoft.EntityFrameworkCore;
using MyBlog.Domain;
using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace MyBlog.Data
{
    public sealed class MyAppContext : DbContext, IAppContext
    {
        public MyAppContext(DbContextOptions<MyAppContext> options) : base(options)
        {
            Database.EnsureCreated();
            this.ChangeTracker.LazyLoadingEnabled = false;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
            optionsBuilder
                //Log parameter values
                .EnableSensitiveDataLogging();

        public Microsoft.EntityFrameworkCore.DbSet<Post> Posts { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Category> Categories { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Tag> Tags { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<User> Users { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Role> Roles { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<PostsTags> PostsTags { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Tag>()
                .HasMany(t=>t.Posts)
                .WithMany(p => p.Tags)
                .UsingEntity<PostsTags>(
                    pt => pt
                        .HasOne(pt => pt.Post)
                        .WithMany()
                        .HasForeignKey("PostId"),
                    pt => pt
                        .HasOne(pt => pt.Tag)
                        .WithMany()
                        .HasForeignKey("TagId"))
                .ToTable("PostsTags")
                .HasKey(et => new { et.PostId, et.TagId });

            builder.Entity<User>()
                .HasKey(u => u.Id);
            builder.Entity<User>()
                .Property(u => u.Id)
                .ValueGeneratedOnAdd();
            builder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.Author)
                .OnDelete(DeleteBehavior.SetNull);
            builder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.Author)
                .OnDelete(DeleteBehavior.SetNull);
            builder.Entity<User>()
                .HasQueryFilter(u => !u.IsDeleted);

            builder.Entity<Role>()
                .HasKey(r => r.Id);
            builder.Entity<Role>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd();

            builder.Entity<Post>()
                .HasKey(e => e.Id);
            builder.Entity<Post>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();
            builder.Entity<Post>()
                .HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Post>()
               .HasMany(p => p.Comments)
               .WithOne(c => c.Post)
               .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Category>()
                .HasKey(c => c.Id);
            builder.Entity<Category>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd();
            builder.Entity<Category>()
                .HasQueryFilter(c => !c.IsDeleted);

            builder.Entity<Tag>()
                .HasKey(t => t.Id);
            builder.Entity<Tag>()
                .Property(t => t.Id)
                .ValueGeneratedOnAdd();

            builder.Entity<Comment>()
                .HasKey(c => c.Id);
            builder.Entity<Comment>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd();
            builder.Entity<Comment>()
                .HasQueryFilter(c => !c.IsDeleted);
        }
    }
}