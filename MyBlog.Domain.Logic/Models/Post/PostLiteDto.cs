using MyBlog.Domain;
using System.Collections.Generic;

namespace MyBlog.DomainLogic.Models.Post
{
    public class PostLiteDto
    {
        public PostLiteDto() 
        {
            Tags = new Dictionary<string, string>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public Category Category { get; set; }
        public string ShortDescription { get; set; }
        public bool HasImage { get; set; }
        public string Image { get; set; }
        public int Comments { get; set; }
        public Dictionary<string, string> Tags { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorPhoto { get; set; }
        public string PublicationTime { get; set; }
    }
}
