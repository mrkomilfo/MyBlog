 using System;
using System.Collections.Generic;

namespace MyBlog.Domain
{
    public sealed class Post
    {
        public Post()
        {
            Comments = new HashSet<Comment>();
            Tags = new HashSet<Tag>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public int? AuthorId { get; set; }
        public User Author { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public DateTime PublicationTime { get; set; }
        public bool HasImage { get; set; }
        public bool IsDeleted { get; set; }
    }
}
