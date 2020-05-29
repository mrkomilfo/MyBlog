namespace MyBlog.DomainLogic.Models.User
{
    public class UserToChangeRoleDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
    }
}
