using System.Threading.Tasks;

namespace MyBlog.DomainLogic.Services
{
    public interface ICensor
    {
        public Task<string> HandleMessage(string message);
    }
}
