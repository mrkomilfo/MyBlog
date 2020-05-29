using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.Post
{
    public class NewCommentDto
    {
        [Required]
        public string Value { get; set; }
        [Required]
        public int AuthorId { get; set; }
        [Required]
        public int PostId { get; set; }
    }
}
