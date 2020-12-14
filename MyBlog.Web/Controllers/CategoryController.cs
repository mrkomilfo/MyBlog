using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DomainLogic.Interfaces;
using MyBlog.Domain;
using Microsoft.AspNetCore.Authorization;
using MyBlog.Web.Filters;
using MyBet.DomainLogic.Models.Categories;

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

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [ModelStateValidation]
        public async Task<ActionResult> Post([FromBody] CategoryCreateDto categoryCreateDto)
        {
            await _categoryManager.AddCategoryAsync(categoryCreateDto);
            return Ok();
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [ModelStateValidation]
        public async Task<ActionResult> Put([FromBody] Category category)
        {
            await _categoryManager.UpdateCategoryAsync(category);
            return Ok();
        }

        [HttpDelete("{categoryId}")]
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        public async Task<ActionResult> Delete(int categoryId)
        {
            await _categoryManager.DeleteCategoryAsync(categoryId, false);
            return Ok();
        }
    }
}
