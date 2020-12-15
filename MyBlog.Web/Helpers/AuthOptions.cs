using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MyBlog.Web.Helpers
{
    public class AuthOptions
    {
		public const string ISSUER = "MyBlog";
		public const string AUDIENCE = "User";
		const string KEY = "super_secret_security_key";
		public const int LIFETIME = 360;
		public static SymmetricSecurityKey GetSymmetricSecurityKey()
		{
			return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
		}
	}
}
