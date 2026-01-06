using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace UAV_Mission_Manager_DAL.Entities
{
    public class User
    {
        public string Username { get; set; } 
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ImagePath { get; set; }
        public int UserRoleId { get; set; }
        public UserRole UserRole { get; set; }
    }

    public class UserConfigurationBuilder : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Username);

            builder.Property(u => u.Username)
                   .IsRequired();

            builder.Property(u => u.Password)
                   .IsRequired(); 

            builder.Property(u => u.FirstName)
                   .IsRequired(); 

            builder.Property(u => u.LastName)
                   .IsRequired();
            builder.Property(u => u.Email)
                   .IsRequired();

            builder.Property(u => u.ImagePath)
                   .IsRequired(false); 

            builder.Property(u => u.UserRoleId)
                   .IsRequired();

            builder.HasOne(u => u.UserRole)
                   .WithMany()
                   .HasForeignKey(u => u.UserRoleId);
        }
    }
}
