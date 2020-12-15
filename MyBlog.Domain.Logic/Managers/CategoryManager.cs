using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyBet.DomainLogic.Models.Categories;
using MyBlog.Data;
using MyBlog.Domain;
using MyBlog.DomainLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Managers
{
    public class CategoryManager : ICategoryManager
    {
        private readonly IAppContext _appContext;
        private readonly IMapper _mapper;

        public CategoryManager(IAppContext appContext, IMapper mapper)
        {
            _appContext = appContext;
            _mapper = mapper;
        }

        public async Task<ICollection<Category>> GetCategoriesAsync()
        {
            return await _appContext.Categories.ToListAsync();
        }

        public async Task<Category> GetCategoryAsync(int categoryId)
        {
            var category = await _appContext.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
            {
                throw new NullReferenceException($"Category with id={categoryId} not found");
            }
            return category;
        }

        public async Task AddCategoryAsync(CategoryCreateDto category)
        {
            if (await _appContext.Categories.AnyAsync(c => Equals(c.Name.ToLower(), category.Name.ToLower())))
            {
                throw new ArgumentOutOfRangeException("Category with this name already exist");
            }
            await _appContext.Categories.AddAsync(_mapper.Map<Category>(category));
            await _appContext.SaveChangesAsync(default);
        }

        public async Task UpdateCategoryAsync(Category category)
        {
            var update = await _appContext.Categories.FirstOrDefaultAsync(c => c.Id == category.Id);
            if (update == null)
            {
                throw new KeyNotFoundException($"Category with id={category.Id} not found");
            }
            update.Name = category.Name;
            await _appContext.SaveChangesAsync(default);
        }

        public async Task DeleteCategoryAsync(int categoryId, bool force = false)
        {
            var category = await _appContext.Categories.IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with id={categoryId} not found");
            }
            if (force)
            {
                _appContext.Categories.Remove(category);
            }
            else
            {
                category.IsDeleted = true;
            }
            await _appContext.SaveChangesAsync(default);
        }
    }
}
