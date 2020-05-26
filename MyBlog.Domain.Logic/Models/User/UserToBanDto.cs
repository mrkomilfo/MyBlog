namespace MyBlog.DomainLogic.Models.User
{
    public class UserToBanDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public bool IsBanned { get; set; }
    }
}
