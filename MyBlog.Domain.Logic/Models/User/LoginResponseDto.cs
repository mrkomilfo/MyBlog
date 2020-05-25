namespace MyBlog.DomainLogic.Models.User
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}
