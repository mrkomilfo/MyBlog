using Microsoft.IdentityModel.Tokens;
using MyBlog.Data;
using MyBlog.DomainLogic.Helpers;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.DomainLogic.Models.User;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Managers
{
    public class UserManager : IUserManager
    {
        private readonly IAppContext _myAppContext;
        public UserManager(IAppContext myAppContext)
        {
            _myAppContext = myAppContext;
        }

        public async Task<DateTime?> GetUnlockTime(int userId)
        {
            if (!await _myAppContext.Users.AnyAsync(u => u.Id == userId))
            {
                throw new NullReferenceException($"User with id={userId} not found");
            }
            return (await _myAppContext.Users.FirstAsync(u => u.Id == userId)).UnlockTime;
        }

        public async Task<LoginResponseDto> Login(LoginDto model)
        {
            var identity = await GetIdentity(model.Login, model.Password);
            if (identity == null)
            {
                throw new NullReferenceException($"Wrong login or password");
            }
            var unlockTime = await GetUnlockTime(Int32.Parse(identity.Name));
            if (unlockTime != null && ((unlockTime ?? DateTime.Now) > DateTime.Now))
            {
                throw new UnauthorizedAccessException($"Banned until {unlockTime?.ToString("f")}");
            }

            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new LoginResponseDto
            {
                AccessToken = encodedJwt,
                Name = identity.Name,
                Role = identity.Claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault().Value,
            };
            return response;
        }
        private async Task<ClaimsIdentity> GetIdentity(string login, string password)
        {
            ClaimsIdentity identity = null;
            var user = await _myAppContext.Users.Include(u => u.Role).FirstOrDefaultAsync(u => string.Equals(u.Login, login));
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            var passwordHash = HashGenerator.Encrypt(password);
            if (passwordHash == user.Password)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Id.ToString()),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role.Name)
                };
                identity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            }
            return identity;
        }
    }
}
