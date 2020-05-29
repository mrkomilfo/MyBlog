using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.DomainLogic.Models.Common;
using MyBlog.DomainLogic.Models.Post;
using MyBlog.Web.Service;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MyBlog.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ExceptionController
    {
        private IPostManager _postManager;
        private IHostServices _hostServices;

        public PostController(IPostManager postManager, IHostServices hostServices)
        {
            _postManager = postManager;
            _hostServices = hostServices;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Create([FromForm] PostCreateDto PostCreateDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    var hostRoot = _hostServices.GetHostPath();
                    await _postManager.AddPostAsync(PostCreateDto, hostRoot);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpGet("{postId}/update")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<PostToUpdateDto>> Update(int postId)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userId = Int32.Parse(User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value);
                int authorId = await _postManager.GetPostAuthorIdAsync(postId);
                if (role != "Admin" && userId != authorId)
                {
                    return Forbid("Access denied");
                }
                return Ok(await _postManager.GetPostToUpdateAsync(postId));
            });
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Update([FromForm] PostUpdateDto PostUpdateDto)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value;
                var authorId = await _postManager.GetPostAuthorIdAsync(PostUpdateDto.Id);
                if (role != "Admin" && Int32.Parse(userId) != authorId)
                {
                    return Forbid("Access denied");
                }
                if (ModelState.IsValid)
                {
                    var hostRoot = _hostServices.GetHostPath();
                    await _postManager.UpdatePostAsync(PostUpdateDto, hostRoot);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpGet]
        public async Task<ActionResult<Page<PostLiteDto>>> Index([FromQuery] int page = 0, int pageSize = 2, string name = null, int? categoryId = null, string tags = null, string from = null, string to = null, int? author = null)
        {
            return await HandleExceptions(async () =>
            {
                return Ok(await _postManager.GetPostsAsync(page, pageSize, name, categoryId, tags, from, to, author));
            });
        }

        [HttpGet("{postId}")]
        public async Task<ActionResult<PostFullDto>> Details(int postId)
        {
            return await HandleExceptions(async () => Ok(await _postManager.GetPostAsync(postId)));
        }

        [HttpDelete("{postId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Delete(int postId)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value;
                var authorId = await _postManager.GetPostAuthorIdAsync(postId);
                if (role != "Admin" && Int32.Parse(userId) != authorId)
                {
                    return Forbid("Access denied");
                }
                var hostRoot = _hostServices.GetHostPath();
                await _postManager.DeletePostAsync(postId, false, hostRoot);
                return Ok();
            });
        }
    }
}
