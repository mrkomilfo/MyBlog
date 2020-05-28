namespace MyBlog.DomainLogic.Models.User
{
    public class UserToUpdateDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool HasPhoto { get; set; }
        public string Photo { get; set; }
    }
}
