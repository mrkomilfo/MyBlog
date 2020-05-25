using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class LoginDto
    {
        [Required]
        public string Login { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
