using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class ChangeRoleDto
    {
        [Required]
        public string RoleName { get; set; }
    }
}
