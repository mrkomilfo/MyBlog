using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyBlog.Domain;

namespace MyBlog.Data
{
    public interface IAppContext
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        public DbSet<Post> Posts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<PostsTags> PostsTags { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
