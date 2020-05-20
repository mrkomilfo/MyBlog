using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Domain
{
    public sealed class User
    {
        public User()
        {
            Posts = new HashSet<Post>();
            Comments = new HashSet<Comment>();
        }

        public int Id { get; set; }
        public string UserName { get; set; }
        [Index("INDEX_LOGIN", IsClustered = true, IsUnique = true)]
        public string Login { get; set; }
        public string Password { get; set; }
        public int? RoleId { get; set; }
        public Role Role { get; set; }
        public DateTime? UnlockTime { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public DateTime RegistrationDate { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public bool HasPhoto { get; set; }
        public bool IsDeleted { get; set; }
    }
}
