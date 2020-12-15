using MyBlog.DomainLogic.Helpers;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace MyBlog.Tests
{
    public class HelperTests
    {
        [Fact]
        public void ParseTags()
        {
            string[] tagLists = {
                "Tag1, tag2 ",
                "Tag1,tAG2 ",
                "Tag1, taG1, ",
                ",,,,,TAG1,,",
                "," ,
                ", ,"
            };

            IEnumerable<string>[] parsedTagLists = tagLists.Select(tl => tl.ParseSubstrings(",")).ToArray();

            Assert.Equal(parsedTagLists[0], new List<string> { "tag1", "tag2" });
            Assert.Equal(parsedTagLists[1], new List<string> { "tag1", "tag2" });
            Assert.Equal(parsedTagLists[2], new List<string> { "tag1" });
            Assert.Equal(parsedTagLists[3], new List<string> { "tag1" });
            Assert.Empty(parsedTagLists[4]);
            Assert.Empty(parsedTagLists[5]);
        }
    }
}
