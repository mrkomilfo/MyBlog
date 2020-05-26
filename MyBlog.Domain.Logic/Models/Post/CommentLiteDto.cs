namespace MyBlog.DomainLogic.Models.Post
{
    public class CommentLiteDto
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorPhoto { get; set; }
        public string PublicationTime { get; set; }
    }
}
