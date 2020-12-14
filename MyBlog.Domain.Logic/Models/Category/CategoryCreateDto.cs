using System.ComponentModel.DataAnnotations;

namespace MyBet.DomainLogic.Models.Categories
{
    public class CategoryCreateDto
    {
        [Required]
        public string Name { get; set; }
    }
}