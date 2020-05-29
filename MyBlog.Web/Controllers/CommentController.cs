using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.DomainLogic.Managers;
using MyBlog.DomainLogic.Models.Post;

namespace MyBlog.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ExceptionController
    {
        private readonly ICommentManager _commentManager;
        public CommentController(ICommentManager commentManager)
        {
            _commentManager = commentManager;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] NewCommentDto newCommentDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    await _commentManager.AddCommentAsync(newCommentDto);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpDelete("{commentId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Delete(int commentId)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value;
                var authorId = await _commentManager.GetCommentAuthorIdAsync(commentId);
                if (role != "Admin" && Int32.Parse(userId) != authorId)
                {
                    return Forbid("Access denied");
                }
                await _commentManager.DeleteCommentAsync(commentId, false);
                return Ok();
            });
        }
    }
}
