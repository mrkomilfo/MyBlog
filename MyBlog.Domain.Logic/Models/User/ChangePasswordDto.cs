using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class ChangePasswordDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword")]
        public string NewPasswordConfirm { get; set; }
    }
}
