using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class UserRole
    {
        public int Id { get; set; } 
        public string Name { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();

        public static implicit operator string(UserRole v)
        {
            throw new NotImplementedException();
        }
    }

    public class UserRoleConfigurationBuilder : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.HasKey(ur => ur.Id);

            builder.Property(ur => ur.Id)
                   .IsRequired()
                   .ValueGeneratedOnAdd();

            builder.Property(ur => ur.Name)
                   .IsRequired();

            builder.HasMany(ur => ur.Users)
                   .WithOne(u => u.UserRole)
                   .HasForeignKey(u => u.UserRoleId);

        }
    }
}
