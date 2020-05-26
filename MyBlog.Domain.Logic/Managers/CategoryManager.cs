using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
    }
}
