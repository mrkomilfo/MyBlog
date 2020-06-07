using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using MyBlog.Domain;

namespace MyBlog.Data
{
    public static class DBInitializer
    {
        public static async Task InitializePosts(IAppContext context)
        {
            if (!await context.Categories.AnyAsync())
            {
                IEnumerable<Category> categories = new List<Category>()
                {
                    new Category("Other"),
                    new Category("Programming"),
                    new Category("Travelling"),
                    new Category("Events"),
                    new Category("Memes"),
                };
                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync(default);

                IEnumerable<Tag> tags = new List<Tag>()
                {
                    new Tag("tag1"),
                    new Tag("tag2"),
                    new Tag("tag3"),
                    new Tag("tag4"),
                };
                await context.Tags.AddRangeAsync(tags);
                await context.SaveChangesAsync(default);

                IEnumerable<Post> posts = new List<Post>()
                {
                    new Post()
                        {
                        Name = "First post",
                        CategoryId = categories.ElementAtOrDefault(1)?.Id,
                        ShortDescription = "Short description of first post",
                        Description = "Lorem ipsum dolor sit amet, sed at omnes tempor malorum, mei debet virtute phaedrum eu. Cu zril volutpat moderatius vim, ex his dico commodo prompta. Ludus aeterno nonumes eum te, libris periculis cu usu, eos cibo copiosae fabellas ad. Dolore efficiantur te eum, ceteros placerat concludaturque est in. Ne eros aliquam ponderum ius.",
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "accountManager")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now.AddDays(-2),
                        HasImage = true
                    },
                    new Post()
                    {
                        Name = "Second post",
                        CategoryId = categories.ElementAtOrDefault(0)?.Id,
                        ShortDescription = "Short description of second post",
                        Description = "Mel causae hendrerit in. No clita civibus vix, sed ex sententiae elaboraret. Integre ornatus usu in. Et saperet laoreet vel, eu ius tation apeirian voluptaria. Pri discere scripserit eu. Offendit suscipit qui no, ut usu essent vidisse fastidii. At sed amet euismod habemus.",
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "user")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now.AddDays(-1),
                        HasImage = true
                    },
                    new Post()
                    {
                        Name = "Third post",
                        CategoryId = categories.ElementAtOrDefault(2)?.Id,
                        ShortDescription = "Short description of third post",
                        Description = "Suspendisse porta nisi augue, quis mattis odio iaculis nec. Pellentesque tristique tempus turpis. Cras orci mauris, fermentum non tempus vitae, feugiat quis turpis. Integer sed turpis id magna egestas dignissim. Cras eros ipsum, dictum vehicula dictum ut, sagittis at erat. Vivamus id posuere lorem. Donec aliquet massa ac nibh consequat vulputate.",
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "admin")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now,
                        HasImage = true
                    }
                };
                await context.Posts.AddRangeAsync(posts);
                await context.SaveChangesAsync(default);

                IEnumerable<PostsTags> postTags = new List<PostsTags>()
                {
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(0)?.Id, TagId = (int)tags.ElementAtOrDefault(0)?.Id},
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(0)?.Id, TagId = (int)tags.ElementAtOrDefault(1)?.Id},
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(1)?.Id, TagId = (int)tags.ElementAtOrDefault(2)?.Id},
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(1)?.Id, TagId = (int)tags.ElementAtOrDefault(3)?.Id},
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(2)?.Id, TagId = (int)tags.ElementAtOrDefault(1)?.Id},
                    new PostsTags{PostId = (int)posts.ElementAtOrDefault(2)?.Id, TagId = (int)tags.ElementAtOrDefault(2)?.Id},
                };
                context.PostsTags.AddRange(postTags);
                await context.SaveChangesAsync(default);

                IEnumerable<Comment> comments = new List<Comment>()
                {
                    new Comment{
                        Value = "Cool!",
                        PostId = (int)posts.ElementAtOrDefault(0)?.Id,
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "admin")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now.AddDays(-1)
                    },
                    new Comment{
                        Value = "Awesome!",
                        PostId = (int)posts.ElementAtOrDefault(1)?.Id, 
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "accountManager")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now.AddHours(-1)
                    },
                    new Comment{
                        Value = "Amazing!",
                        PostId = (int)posts.ElementAtOrDefault(2)?.Id,
                        AuthorId = context.Users.Where(u => string.Equals(u.Login, "user")).Select(u => u.Id).FirstOrDefault(),
                        PublicationTime = DateTime.Now
                    }

                };
                context.Comments.AddRange(comments);
                await context.SaveChangesAsync(default);
            }
        }

        public static async Task InitializeUsers(MyAppContext context)
        {
            if (!(await context.Roles.AnyAsync() || await context.Users.AnyAsync()))
            {
                IEnumerable<Role> roles = new List<Role>()
                {
                    new Role { Name = "Account manager"},
                    new Role { Name = "Admin"},
                    new Role { Name = "User"},
                }; 
                context.Roles.AddRange(roles);
                await context.SaveChangesAsync();

                IEnumerable<User> users = new List<User>()
                {
                    new User
                    {
                        Login = "accountManager",
                        Password = "YIMMU3jl8cYYVN8TGTunenCKof4NfTmY8D0/quh0WU4=", //accountManager
                        UserName = "AccountManager",
                        RoleId = roles.ElementAtOrDefault(0)?.Id,
                        RegistrationDate = DateTime.Now,
                    },
                    new User
                    {
                        Login = "admin",
                        Password = "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=", //admin
                        UserName = "Administrator",
                        RoleId = roles.ElementAtOrDefault(1)?.Id,
                        RegistrationDate = DateTime.Now,
                        HasPhoto = true,
                    },
                    new User
                    {
                        Login = "user",
                        Password = "BPiZbadjt6lpsQKO4wB1aerzpjVIbdqyEdUSyFud+Ps=", //user
                        UserName = "User",
                        RoleId = roles.ElementAtOrDefault(2)?.Id,
                        RegistrationDate = DateTime.Now,
                        HasPhoto = true,
                    },
                };
                context.Users.AddRange(users);
                await context.SaveChangesAsync();
            }
        }
    }
}
