using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyBlog.Domain;
using MyBlog.DomainLogic.Models.Common;
using MyBlog.DomainLogic.Models.User;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface IUserManager
    {
        Task RegisterUserAsync(RegisterDto user);
        Task UpdateUserAsync(UserUpdateDto user, string hostRoot);
        Task<DateTime?> GetUnlockTimeAsync(int userId);
        Task<LoginResponseDto> LoginAsync(LoginDto model);
        Task<UserFullDto> GetUserAsync(int userId);
        Task<Page<UserLiteDto>> GetUsersAsync(int index, int pageSize, string search);
        Task<UserToUpdateDto> GetUserToUpdateAsync(int userId);
        Task<UserToBanDto> GetUserToBanAsync(int userId);
        Task<UserToChangeRoleDto> GetUserToChangeRoleAsync(int userId);
        Task<IEnumerable<Role>> GetRolesAsync();
        Task<Role> GetUserRoleAsync(int userId);
        Task ChangePasswordAsync(ChangePasswordDto changePasswordDto);
        Task BanUserAsync(BanDto banDTO);
        Task UnbanUserAsync(int userId);
    }
}
