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
using MyBlog.Domain;
using AutoMapper;
using MyBlog.DomainLogic.Models.Common;

namespace MyBlog.DomainLogic.Managers
{
    public class UserManager : IUserManager
    {
        private readonly IAppContext _appContext;
        private readonly IMapper _mapper;
        public UserManager(IAppContext appContext, IMapper mapper)
        {
            _appContext = appContext;
            _mapper = mapper;
        }

        public async Task<DateTime?> GetUnlockTime(int userId)
        {
            if (!await _appContext.Users.AnyAsync(u => u.Id == userId))
            {
                throw new NullReferenceException($"User with id={userId} not found");
            }
            return (await _appContext.Users.FirstAsync(u => u.Id == userId)).UnlockTime;
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
            var user = await _appContext.Users.Include(u => u.Role).FirstOrDefaultAsync(u => string.Equals(u.Login, login));
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

        public async Task<UserFullDto> GetUserAsync(int userId)
        {
            var DBUser = await _appContext.Users.Include(u => u.Role).Include(u => u.Posts).FirstOrDefaultAsync(u => u.Id == userId);
            if (DBUser == null)
            {
                throw new NullReferenceException($"User with id={userId} not found");
            }
            var user = _mapper.Map<UserFullDto>(DBUser);

            string imageName = DBUser.HasPhoto ? userId.ToString() : "default";
            string path = $"img\\users\\{imageName}.jpg";
            user.Photo = path;

            return user;
        }

        public async Task<Page<UserLiteDto>> GetUsersAsync(int index, int pageSize, string search)
        {
            var result = new Page<UserLiteDto>() { CurrentPage = index, PageSize = pageSize };
            var query = _appContext.Users.Include(e => e.Role).AsQueryable();
            if (search != null)
            {
                query = query.Where(u => u.UserName.ToLower().Contains(search.ToLower()));
            }
            result.TotalRecords = await query.CountAsync();
            result.Records = await _mapper.ProjectTo<UserLiteDto>(query).ToListAsync(default);
            return result;
        }

        public async Task<UserToUpdateDto> GetUserToUpdateAsync(int userId)
        {
            User user = await _appContext.Users.FindAsync(userId);
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            UserToUpdateDto userToUpdate = _mapper.Map<UserToUpdateDto>(user);
            if (userToUpdate.HasPhoto)
            {
                userToUpdate.Photo = $"img\\users\\{userId}.jpg";
            }
            return userToUpdate;
        }

        public async Task<UserToBanDto> GetUserToBanAsync(int userId)
        {
            var user = await _appContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            UserToBanDto userToBan = _mapper.Map<UserToBanDto>(user);
            return userToBan;
        }

        public async Task<UserToChangeRoleDto> GetUserToChangeRoleAsync(int userId)
        {
            User user = await _appContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            UserToChangeRoleDto userRoleDto = _mapper.Map<UserToChangeRoleDto>(user);
            return userRoleDto;
        }

        public async Task<IEnumerable<Role>> GetRolesAsync()
        {
            return await _appContext.Roles.ToListAsync();
        }

        public async Task<Role> GetUserRoleAsync(int userId)
        {
            if (!await _appContext.Users.AnyAsync(u => u.Id == userId))
            {
                throw new NullReferenceException($"Event with id={userId} not found");
            }
            return await _appContext.Users.Include(u => u.Role).Where(u => u.Id == userId).Select(u => u.Role).FirstOrDefaultAsync();
        }
    }
}
