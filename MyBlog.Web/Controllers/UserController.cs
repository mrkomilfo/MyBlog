using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MyBlog.DomainLogic.Models.User;
using MyBlog.Domain;
using MyBlog.DomainLogic.Models.Common;
using MyBlog.Web.Service;

namespace MyBlog.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ExceptionController
    {
        private IUserManager _userManager;
        private IHostServices _hostServices;
        public UserController(IUserManager userManager, IHostServices hostServices)
        {
            _userManager = userManager;
            _hostServices = hostServices;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] RegisterDto registerDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    await _userManager.RegisterUserAsync(registerDto);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpGet("{userId}/update")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<UserToUpdateDto>> Update(int userId)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var currentUserId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value;
                if (role != "Admin" && Int32.Parse(currentUserId) != userId)
                {
                    return Forbid("Access denied");
                }
                var hostRoot = _hostServices.GetHostPath();
                return Ok(await _userManager.GetUserToUpdateAsync(userId));
            });
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Update([FromForm] UserUpdateDto userUpdateDTO)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultNameClaimType))?.Value;
                if (role != "Admin" && Int32.Parse(userId) != userUpdateDTO.Id)
                {
                    return Forbid("Access denied");
                }
                if (ModelState.IsValid)
                {
                    var hostRoot = _hostServices.GetHostPath();
                    await _userManager.UpdateUserAsync(userUpdateDTO, hostRoot);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpPost]
        [Route("signIn")]
        public async Task<ActionResult> SignIn([FromBody] LoginDto loginDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    return Ok(await _userManager.LoginAsync(loginDto));
                }
                return BadRequest("Model state is not valid");
            });
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Account manager")]
        public async Task<ActionResult<Page<UserLiteDto>>> Index([FromQuery] int index = 0, int pageSize = 20, string search = null)
        {
            return await HandleExceptions(async () =>
            {
                var role = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                if (role != "Admin" && role != "Account manager")
                {
                    return Forbid("Access denied");
                }
                return Ok(await _userManager.GetUsersAsync(index, pageSize, search));
            });
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserFullDto>> Details(int userId)
        {
            return await HandleExceptions(async () =>
            {
                var hostRoot = _hostServices.GetHostPath();
                return Ok(await _userManager.GetUserAsync(userId));
            });
        }

        [HttpGet("{userId}/ban")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Account manager")]
        public async Task<ActionResult<UserToBanDto>> Ban(int userId)
        {
            return await HandleExceptions(async () =>
            {
                var currentRole = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimsIdentity.DefaultRoleClaimType))?.Value;
                var userRole = (await _userManager.GetUserRoleAsync(userId)).ToString();
                if (userRole == "Account manager" || userRole == currentRole)
                {
                    return Forbid("Lack of rights");
                }
                return Ok(await _userManager.GetUserToBanAsync(userId));
            });
        }

        [HttpGet]
        [Route("roles")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Account manager")]
        public async Task<ActionResult<IEnumerable<Role>>> Roles()
        {
            return await HandleExceptions(async () => Ok(await _userManager.GetRolesAsync()));
        }

        [HttpGet("{userId}/role")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Account manager")]
        public async Task<ActionResult<UserToChangeRoleDto>> ChangeRole(int userId)
        {
            return await HandleExceptions(async () => Ok(await _userManager.GetUserToChangeRoleAsync(userId)));
        }

        [HttpPut]
        [Route("changePassword")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            return await HandleExceptions(async () =>
            {
                if (ModelState.IsValid)
                {
                    await _userManager.ChangePasswordAsync(changePasswordDto);
                    return Ok();
                }
                return BadRequest("Model state is not valid");
            });
        }
    }
}
