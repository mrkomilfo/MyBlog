using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; }
        public string Email { get; set; }
        [Required]
        public string Login { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string PasswordConfirm { get; set; }
    }
}
