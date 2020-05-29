using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyBlog.Data;
using MyBlog.Domain;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.DomainLogic.Models.Post;
using System;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Managers
{
    public class CommentManager : ICommentManager
    {
        private readonly IAppContext _appContext;
        private readonly IMapper _mapper;
        public CommentManager(IAppContext appContext, IMapper mapper)
        {
            _appContext = appContext;
            _mapper = mapper;
        }
        public async Task AddCommentAsync(NewCommentDto comment)
        {
            var newComment = _mapper.Map<Comment>(comment);
            await _appContext.Comments.AddAsync(newComment);
            await _appContext.SaveChangesAsync(default);
        }

        public async Task DeleteCommentAsync(int commentId, bool force = false)
        {
            var comment = await _appContext.Comments.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == commentId);
            if (comment == null)
            {
                throw new NullReferenceException($"Comment with id={commentId} not found");
            }
            if (force)
            {
                _appContext.Comments.Remove(comment);
            }
            else
            {
                comment.IsDeleted = true;
            }
            await _appContext.SaveChangesAsync(default);
        }

        public async Task<int?> GetCommentAuthorIdAsync(int commentId)
        {
            if (!await _appContext.Comments.AnyAsync(c => c.Id == commentId))
            {
                throw new NullReferenceException($"Comment with id={commentId} not found");
            }
            return (await _appContext.Comments.FirstOrDefaultAsync(c => c.Id == commentId))?.AuthorId;
        }
    }
}
