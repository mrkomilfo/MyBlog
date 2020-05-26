using MyBlog.Domain;
using System.Collections.Generic;

namespace MyBlog.DomainLogic.Models.Post
{
    public class PostFullDto
    {
        public PostFullDto()
        {
            Tags = new Dictionary<string, string>();
            Comments = new HashSet<CommentLiteDto>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public Category Category { get; set; }
        public string Description { get; set; }
        public bool HasImage { get; set; }
        public string Image { get; set; }
        public ICollection<CommentLiteDto> Comments { get; set; }
        public Dictionary<string, string> Tags { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorPhoto { get; set; }
        public string PublicationTime { get; set; }
    }
}
