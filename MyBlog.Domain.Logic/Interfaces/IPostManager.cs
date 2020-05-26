using MyBlog.DomainLogic.Models.Common;
using MyBlog.DomainLogic.Models.Post;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface IPostManager
    {
        Task<PostFullDto> GetPostAsync(int postId);
        Task<Page<PostLiteDto>> GetPostsAsync(int index, int pageSize, string search, int? categoryId, string tags, string from, string to, int? author);
        Task<PostToUpdateDto> GetPostToUpdateAsync(int postId);
        Task<int> GetPostAuthorIdAsync(int postId);
    }
}
