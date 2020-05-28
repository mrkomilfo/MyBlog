using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyBlog.Data;
using MyBlog.Domain;
using MyBlog.DomainLogic.Helpers;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.DomainLogic.Models.Common;
using MyBlog.DomainLogic.Models.Post;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Managers
{
    public class PostManager : IPostManager
    {
        private readonly IAppContext _appContext;
        private readonly IMapper _mapper;

        public PostManager(IAppContext appContext, IMapper mapper)
        {
            _appContext = appContext;
            _mapper = mapper;
        }

        public async Task<Page<PostLiteDto>> GetPostsAsync(int index, int pageSize, string name, int? categoryId, string tags, string from, string to, int? author)
        {
            List<string> stringTags = tags?.ParseSubstrings(",").ToList();
            List<int> postIdByTags = new List<int>();
            if (!string.IsNullOrEmpty(tags))
            {
                postIdByTags = _appContext.PostsTags
                    .Include(pt => pt.Tag)
                    .Where(pt => stringTags.Contains(pt.Tag.Name))
                    .AsEnumerable()
                    .GroupBy(pt => pt.PostId)
                    .Where(g => g.Count() == stringTags.Count)
                    .Select(g => g.Key)
                    .ToList();
            }

            var result = new Page<PostLiteDto>() { CurrentPage = index, PageSize = pageSize };
            var query = _appContext.Posts.Include(p => p.Category).Include(p=>p.Author).AsQueryable();
            if (name != null)
            {
                query = query.Where(p => p.Name.ToLower().Contains(name.ToLower()));
            }
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }
            if (tags != null)
            {
                query = query.Where(p => postIdByTags.Contains(p.Id));
            }
            if (from != null)
            {
                query = query.Where(p => DateTime.ParseExact(from, "d/M/yyyy", CultureInfo.InvariantCulture) <= p.PublicationTime.Date);
            }
            if (to != null)
            {
                query = query.Where(p => DateTime.ParseExact(to, "d/M/yyyy", CultureInfo.InvariantCulture) >= p.PublicationTime.Date);
            }
            if (author.HasValue)
            {
                query = query.Where(p => p.AuthorId == author);
            }
            result.TotalRecords = await query.CountAsync();
            query = query.OrderByDescending(p => p.PublicationTime).Skip(index * pageSize).Take(pageSize);
            result.Records = await _mapper.ProjectTo<PostLiteDto>(query).ToListAsync(default);

            for (int i = 0; i < result.Records.Count; i++)
            {
                var postTags = _appContext.PostsTags.Include(pt => pt.Tag).Where(pt => pt.PostId == result.Records[i].Id).Select(pt => pt.Tag).ToHashSet();
                foreach (var tag in postTags)
                {
                    result.Records[i].Tags.Add(tag.Id.ToString(), tag.Name);
                }

                result.Records[i].Comments = _appContext.Comments.Count(c => c.PostId == result.Records[i].Id);

                if (result.Records[i].HasImage)
                {
                    string path = $"img\\posts\\{result.Records[i].Id}.jpg";
                    result.Records[i].Image = path;
                }

                result.Records[i].AuthorPhoto = (await _appContext.Users.FirstAsync(u => u.Id == result.Records[i].AuthorId)).HasPhoto ?
                    $"img\\users\\{result.Records[i].AuthorId}.jpg" :
                    "img\\users\\default.jpg";
            }
            return result;
        }

        public async Task<PostFullDto> GetPostAsync(int postId)
        {
            var DbPost = await _appContext.Posts.Include(p => p.Author).Include(p => p.Category).Include(p=>p.Comments).ThenInclude(p=>p.Author).FirstOrDefaultAsync(e => e.Id == postId);
            if (DbPost == null)
            {
                throw new NullReferenceException($"Post with id={postId} not found");
            }
            var postFullDto = _mapper.Map<PostFullDto>(DbPost);

            var tags = _appContext.PostsTags.Include(pt => pt.Tag).Where(pt => pt.PostId == postId).Select(pt => pt.Tag).ToHashSet();
            foreach (var tag in tags)
            {
                postFullDto.Tags.Add(tag.Id.ToString(), tag.Name);
            }

            if (DbPost.HasImage)
            {
                postFullDto.Image = $"img\\posts\\{postId}.jpg";
            }

            postFullDto.AuthorPhoto = (await _appContext.Users.FirstAsync(u => u.Id == postFullDto.AuthorId)).HasPhoto ?
                $"img\\users\\{postFullDto.AuthorId}.jpg" :
                "img\\users\\default.jpg";           

            for (int i = 0; i < postFullDto.Comments.Count; i++)
            {
                postFullDto.Comments.ElementAt(i).AuthorPhoto = (await _appContext.Users.FirstAsync(u => u.Id == postFullDto.Comments.ElementAt(i).AuthorId)).HasPhoto ?
                    $"img\\users\\{postFullDto.Comments.ElementAt(i).AuthorId}.jpg" :
                    "img\\users\\default.jpg";
            }

            return postFullDto;
        }

        public async Task<PostToUpdateDto> GetPostToUpdateAsync(int postId)
        {
            var post = await _appContext.Posts.FirstOrDefaultAsync(p => p.Id == postId);
            if (post == null)
            {
                throw new NullReferenceException($"Post with id={postId} not found");
            }
            PostToUpdateDto postToUpdate = _mapper.Map<PostToUpdateDto>(post);

            if (post.HasImage)
            {
                postToUpdate.Image = $"img\\posts\\{postId}.jpg";
            }
            var tags = _appContext.PostsTags.Include(pt => pt.Tag).Where(pt => pt.PostId == postId).Select(pt => pt.Tag.Name).ToHashSet();
            postToUpdate.Tags = String.Join(", ", tags);
            return postToUpdate;
        }

        public async Task<int> GetPostAuthorIdAsync(int postId)
        {
            if (!await _appContext.Posts.AnyAsync(p => p.Id == postId))
            {
                throw new NullReferenceException($"Post with id={postId} not found");
            }
            return (int)(await _appContext.Posts.FirstOrDefaultAsync(p => p.Id == postId)).AuthorId;
        }
    }
}
