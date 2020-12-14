using MyBet.DomainLogic.Models.Categories;
using MyBlog.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Interfaces
{
    public interface ICategoryManager
    {
        Task<Category> GetCategoryAsync(int categoryId);
        Task<ICollection<Category>> GetCategoriesAsync();
        Task AddCategoryAsync(CategoryCreateDto category);
        Task UpdateCategoryAsync(Category category);
        Task DeleteCategoryAsync(int categoryId, bool force);
    }
}
