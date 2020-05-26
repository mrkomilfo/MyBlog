namespace MyBlog.DomainLogic.Models.User
{
    public class UserFullDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public string Email { get; set; }
        public string RegistrationDate { get; set; }
        public int WritedPosts { get; set; }
        public string Photo { get; set; }
    }
}
