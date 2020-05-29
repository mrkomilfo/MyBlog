using System.ComponentModel.DataAnnotations;

namespace MyBlog.DomainLogic.Models.User
{
    public class BanDto
    {
        [Required]
        public int Id { get; set; }
        public int? Days { get; set; }
        public int? Hours { get; set; }
    }
}
