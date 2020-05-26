using Microsoft.AspNetCore.Hosting;

namespace MyBlog.Web.Service
{
    public class HostServices : IHostServices
    {
        private readonly IWebHostEnvironment _environment;
        public HostServices(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public string GetHostPath()
        {
            return _environment.ContentRootPath;
        }
    }
}
