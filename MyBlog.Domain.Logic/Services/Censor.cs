using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MyBlog.Data;

namespace MyBlog.DomainLogic.Services
{
    public class Censor : ICensor
    {
        private readonly ISwearingProvider _swearingProvider;
        public Censor(ISwearingProvider swearingProvider)
        {
            _swearingProvider = swearingProvider;
        }

        private string MakeRegex(string word)
        {
            return Regex.Replace(word, ".{1}", "$0+");
        }

        public Task<string> HandleMessage(string message)
        {
            var swears = _swearingProvider.GetSwearing();
            foreach (string word in swears)
            {
                string pattern = MakeRegex(word);
                Match match = Regex.Match(message, pattern, RegexOptions.IgnoreCase);
                if (match.Length != 0)
                {
                    message = Regex.Replace(message, match.Value, new string('*', match.Length));
                }
            }
            return Task.FromResult(message);
        }
    }
}
