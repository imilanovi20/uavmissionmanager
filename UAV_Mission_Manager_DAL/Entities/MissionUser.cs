using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class MissionUser
    {
        public int MissionId { get; set; }
        public string Username { get; set; }

        public Mission Mission { get; set; }
        public User User { get; set; }
    }

    public class MissionUserConfigurationBuilder : IEntityTypeConfiguration<MissionUser>
    {
        public void Configure(EntityTypeBuilder<MissionUser> builder)
        {
            builder.HasKey(mu => new { mu.MissionId, mu.Username });

            builder.HasOne(mu => mu.Mission)
                   .WithMany(m => m.MissionUsers)
                   .HasForeignKey(mu => mu.MissionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mu => mu.User)
                   .WithMany(u => u.MissionUsers)
                   .HasForeignKey(mu => mu.Username)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
