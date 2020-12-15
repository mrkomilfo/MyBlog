using Moq;
using MyBlog.Data;
using System.Collections.Generic;
using MyBlog.DomainLogic.Services;
using Xunit;

namespace MyBlog.Tests
{
    public class CensoringTests
    {
        private readonly ICensor _censor;
        public CensoringTests()
        {
            var list = new List<string>
            {
                "fuck",
                "bullshit",
                "shit",
                "asshole",
                "bitch",
                "cunt",
                "slut",
                "whore"
            };

            var swearingProviderMock = new Mock<ISwearingProvider>();
            swearingProviderMock.Setup(provider =>
                provider.GetSwearing()).Returns(list);

            _censor = new Censor(swearingProviderMock.Object);
        }

        [Fact]
        public void HandleMessage()
        {
            string[] messages = {
                "fucking bullshit", "FUUUCKK!!!", "Finally! Some good fucking food", "Only sluts and bitches"
            };

            List<string> censored = new List<string>();
            foreach (var message in messages)
            {
                censored.Add(_censor.HandleMessage(message).Result);
            }

            Assert.Equal("****ing ********", censored[0]);
            Assert.Equal("*******!!!", censored[1]);
            Assert.Equal("Finally! Some good ****ing food", censored[2]);
            Assert.Equal("Only ****s and *****es", censored[3]);
        }
    }
}
