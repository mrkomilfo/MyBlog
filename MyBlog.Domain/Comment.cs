using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Domain
{
    public class Comment
    {
        public int Id { get; set; }
        [Index("INDEX_COMMENT", IsClustered = true, IsUnique = true)]
        public string Value { get; set; }
        public int? PostId { get; set; }
        public Post Post { get; set; }
        public int? AuthorId { get; set; }
        public User Author { get; set; }
        public DateTime PublicationTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
