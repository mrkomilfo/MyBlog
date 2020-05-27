using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.Domain;

namespace MyBlog.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ExceptionController
    {
        private readonly ICategoryManager _categoryManager;
        public CategoryController(ICategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> Index()
        {
            return await HandleExceptions(async () => Ok(await _categoryManager.GetCategoriesAsync()));
        }

        [HttpGet("{categoryId}")]
        public async Task<ActionResult<Category>> Details(int categoryId)
        {
            return await HandleExceptions(async () => Ok(await _categoryManager.GetCategoryAsync(categoryId)));
        }
    }
}
