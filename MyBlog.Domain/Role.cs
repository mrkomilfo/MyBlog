﻿using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Domain
{
    public class Role
    {
        public int Id { get; set; }
        [Index("INDEX_ROLE", IsClustered = true, IsUnique = true)]
        public string Name { get; set; }
    }
}
