using MyBlog.DomainLogic.Models.Common;
using MyBlog.DomainLogic.Models.Post;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface IPostManager
    {
        Task AddPostAsync(PostCreateDto post, string hostRoot);
        Task UpdatePostAsync(PostUpdateDto post, string hostRoot);
        Task<PostFullDto> GetPostAsync(int postId);
        Task<Page<PostLiteDto>> GetPostsAsync(int index, int pageSize, string name, int? categoryId, string tags, string from, string to, int? author);
        Task<PostToUpdateDto> GetPostToUpdateAsync(int postId);
        Task<int> GetPostAuthorIdAsync(int postId);
        Task DeletePostAsync(int postId, bool force, string hostRoot);
    }
}
