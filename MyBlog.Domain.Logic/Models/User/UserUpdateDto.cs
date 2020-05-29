using Microsoft.AspNetCore.Http;
using MyBlog.DomainLogic.Annotations;
using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class UserUpdateDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; }
        public string Email { get; set; }
        [Required]
        public bool HasPhoto { get; set; }
        [MaxFileSize(8 * 1024 * 1024)]
        public IFormFile Photo { get; set; }
    }
}
