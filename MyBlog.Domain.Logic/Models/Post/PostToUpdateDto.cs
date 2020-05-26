namespace MyBlog.DomainLogic.Models.Post
{
    public class PostToUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? CategoryId { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string Tags { get; set; }
        public string Image { get; set; }
    }
}
