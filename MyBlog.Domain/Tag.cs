using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Domain
{
    public class Tag
    {
        public Tag()
        {
        }

        public Tag(string name)
        {
            Name = name;
        }

        public int Id { get; set; }
        [Index("INDEX_TAG", IsClustered = true, IsUnique = true)]
        public string Name { get; set; }
        public virtual ICollection<Post> Posts { get; set; }
    }
}
