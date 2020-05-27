﻿using AutoMapper;
using MyBlog.Domain;
using MyBlog.DomainLogic.Models.Post;
using MyBlog.DomainLogic.Models.User;
using System;

namespace MyBlog.DomainLogic.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<string, Tag>()
                .ForMember(m => m.Name, opt => opt.MapFrom(m => m.ToLower()));
            CreateMap<Tag, string>()
               .ConvertUsing(source => source.Name ?? string.Empty);

            CreateMap<Comment, CommentLiteDto>()
               .ForMember(m => m.AuthorName, opt => opt.MapFrom(m => m.Author.UserName))
               .ForMember(m => m.PublicationTime, opt => opt.MapFrom(m => m.PublicationTime.ToString("f")));
            CreateMap<Post, PostLiteDto>()
                .ForMember(m => m.PublicationDate, opt => opt.MapFrom(m => m.PublicationTime.ToString("d")))
                .ForMember(m => m.AuthorName, opt => opt.MapFrom(m => m.Author.UserName))
                .ForMember(m => m.AuthorId, opt => opt.MapFrom(m => m.Author.Id))
                .ForMember(m => m.Tags, opt => opt.Ignore())
                .ForMember(m => m.Comments, opt => opt.Ignore());
            CreateMap<Post, PostFullDto>()
                .ForMember(m => m.PublicationDate, opt => opt.MapFrom(m => m.PublicationTime.ToString("d")))
                .ForMember(m => m.AuthorName, opt => opt.MapFrom(m => m.Author.UserName))
                .ForMember(m => m.AuthorId, opt => opt.MapFrom(m => m.Author.Id))
                .ForMember(m => m.Tags, opt => opt.Ignore());
            CreateMap<Post, PostToUpdateDto>()
               .ForMember(m => m.Tags, opt => opt.Ignore());

            CreateMap<User, UserToBanDto>()
                .ForMember(m => m.IsBanned, opt => opt.MapFrom(m => m.UnlockTime != null && m.UnlockTime > DateTime.Now));
            CreateMap<User, UserToUpdateDto>();
            CreateMap<User, UserToChangeRoleDto>();
            CreateMap<User, UserFullDto>()
                .ForMember(m => m.Role, opt => opt.MapFrom(m => m.Role.Name))
                .ForMember(m => m.Status, opt => opt.MapFrom(m => m.UnlockTime == null || m.UnlockTime < DateTime.Now ? null : $"Blocked until {m.UnlockTime}"))
                .ForMember(m => m.RegistrationDate, opt => opt.MapFrom(m => m.RegistrationDate.ToString("f")))
                .ForMember(m => m.WritedPosts, opt => opt.MapFrom(m => m.Posts.Count));
            CreateMap<User, UserLiteDto>()
                .ForMember(m => m.RoleName, opt => opt.MapFrom(m => m.Role.Name))
                .ForMember(m => m.Status, opt => opt.MapFrom(m => m.UnlockTime == null || m.UnlockTime < DateTime.Now ? null : $"Blocked until {m.UnlockTime}"));
        }
    }
}