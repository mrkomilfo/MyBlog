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
using System.Threading.Tasks;
using MyBlog.Domain;
using AutoMapper;
using MyBlog.DomainLogic.Models.Common;
using System.IO;

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

        public async Task RegisterUserAsync(RegisterDto user)
        {
            if (await _appContext.Users.AnyAsync(u => string.Equals(u.Login.ToLower(), user.Login.ToLower())))
            {
                throw new ArgumentException($"User with login \"{user.Login}\" already exist");
            }
            User newUser = _mapper.Map<User>(user);
            newUser.RoleId = (await _appContext.Roles.FirstOrDefaultAsync(r => r.Name == "User"))?.Id;
            await _appContext.Users.AddAsync(newUser);
            await _appContext.SaveChangesAsync(default);
        }

        public async Task UpdateUserAsync(UserUpdateDto user, string hostRoot)
        {
            User updatedUser = await _appContext.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
            if (updatedUser == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            _mapper.Map(user, updatedUser);
            if (user.Photo != null)
            {
                string path = $"{hostRoot}\\wwwroot\\img\\users\\{updatedUser.Id}.jpg";
                await using var fileStream = new FileStream(path, FileMode.Create);
                await user.Photo.CopyToAsync(fileStream);
            }
            await _appContext.SaveChangesAsync(default);
        }

        public async Task<DateTime?> GetUnlockTimeAsync(int userId)
        {
            if (!await _appContext.Users.AnyAsync(u => u.Id == userId))
            {
                throw new NullReferenceException($"User with id={userId} not found");
            }
            return (await _appContext.Users.FirstAsync(u => u.Id == userId)).UnlockTime;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto model)
        {
            var identity = await GetIdentityAsync(model.Login, model.Password);
            if (identity == null)
            {
                throw new NullReferenceException($"Wrong login or password");
            }
            var unlockTime = await GetUnlockTimeAsync(Int32.Parse(identity.Name));
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

        private async Task<ClaimsIdentity> GetIdentityAsync(string login, string password)
        {
            ClaimsIdentity identity = null;
            var user = await _appContext.Users.Include(u => u.Role).FirstOrDefaultAsync(u => string.Equals(u.Login, login));
            if (user == null)
            {
                return null;
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
                throw new NullReferenceException($"Post with id={userId} not found");
            }
            return await _appContext.Users.Include(u => u.Role).Where(u => u.Id == userId).Select(u => u.Role).FirstOrDefaultAsync();
        }

        public async Task ChangePasswordAsync(ChangePasswordDto changePasswordDto)
        {
            User user = await _appContext.Users.FirstOrDefaultAsync(u => u.Id == changePasswordDto.Id);
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            if (!Equals(HashGenerator.Encrypt(changePasswordDto.OldPassword), user.Password))
            {
                throw new ArgumentException("Wrong old password");
            }
            user.Password = HashGenerator.Encrypt(changePasswordDto.NewPassword);
            await _appContext.SaveChangesAsync(default);
        }

        public async Task BanUserAsync(BanDto banDto)
        {
            var user = await _appContext.Users.FirstOrDefaultAsync(u => u.Id == banDto.Id);
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            user.UnlockTime = DateTime.Now.AddDays(banDto?.Days ?? 0);
            user.UnlockTime = user.UnlockTime?.AddHours(banDto?.Hours ?? 0);
            await _appContext.SaveChangesAsync(default);
        }

        public async Task UnbanUserAsync(int userId)
        {
            var user = await _appContext.Users.FirstOrDefaultAsync(u => Equals(u.Id, userId));
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            user.UnlockTime = DateTime.Now;
            await _appContext.SaveChangesAsync(default);
        }

        public async Task ChangeUserRoleAsync(int userId, string roleName)
        {
            var user = await _appContext.Users.FirstOrDefaultAsync(u => Equals(u.Id, userId));
            if (user == null)
            {
                throw new NullReferenceException($"User with id={user.Id} not found");
            }
            var role = await _appContext.Roles.FirstOrDefaultAsync(r => Equals(r.Name, roleName));
            if (role == null)
            {
                throw new NullReferenceException($"Role '{roleName}' not found");
            }
            user.RoleId = role.Id;
            await _appContext.SaveChangesAsync(default);
        }
    }
}
