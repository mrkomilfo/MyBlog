using Microsoft.AspNetCore.Http;
using MyBlog.DomainLogic.Annotations;
using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.Post
{
    public class PostUpdateDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        [Required]
        public string ShortDescription { get; set; }
        [Required]
        public string Description { get; set; }        
        public string Tags { get; set; }
        [MaxFileSize(8 * 1024 * 1024)]
        public IFormFile Image { get; set; }
        [Required]
        public bool HasImage { get; set; }
    }
}
