using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MyBlog.DomainLogic.Models.User;

namespace MyBlog.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ExceptionController
    {
        private IUserManager _userManager;
        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        [Route("signIn")]
        public async Task<ActionResult> SignIn([FromBody] LoginDto loginDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    return Ok(await _userManager.Login(loginDto));
                }
                return BadRequest("Model state is not valid");
            });
        }
    }
}
