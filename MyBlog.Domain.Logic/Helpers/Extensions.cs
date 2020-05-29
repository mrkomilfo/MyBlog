using System;
using System.Collections.Generic;
using System.Linq;

namespace MyBlog.DomainLogic.Helpers
{
    public static class Extensions
    {
        public static IEnumerable<string> ParseSubstrings(this string tags, string divider) => tags
            .Split(divider)
            .Select(t => t.Trim().ToLower())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct();

        public static string Flexible(this DateTime dateTime) =>
            /*dateTime.Date == DateTime.Today 
            ? "Today at " + dateTime.ToString("HH:mm") 
            : dateTime.ToString("dd/MM/yyyy");*/
            dateTime.ToString("dd/MM/yyyy HH:mm");
    }
}
