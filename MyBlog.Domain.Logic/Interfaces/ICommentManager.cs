using MyBlog.DomainLogic.Models.Post;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface ICommentManager
    {
        Task AddCommentAsync(NewCommentDto comment);
        Task DeleteCommentAsync(int commentId, bool force);
        Task<int?> GetCommentAuthorIdAsync(int commentId);
    }
}
