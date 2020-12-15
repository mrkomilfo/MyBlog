﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Domain
{
    public class Category
    {
        public Category() { }

        public Category(string name)
        {
            Name = name;
            IsDeleted = false;
        }

        [Required]
        public int Id { get; set; }
        [Index("INDEX_CATEGORY", IsClustered = true, IsUnique = true)]
        [Required]
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
    }
}
