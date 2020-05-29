using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Blog.Helpers
{
    public class AuthOptions
    {
		public const string ISSUER = "Blog";
		public const string AUDIENCE = "User";
		const string KEY = "tokenKey";
		public const int LIFETIME = 60;
		public static SymmetricSecurityKey GetSymmetricSecurityKey()
		{
			return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
		}
	}
}
