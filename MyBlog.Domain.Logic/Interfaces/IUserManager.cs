using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MyBlog.DomainLogic.Models.User;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface IUserManager
    {
        Task<DateTime?> GetUnlockTime(int userId);
        Task<LoginResponseDto> Login(LoginDto model);   
    }
}
