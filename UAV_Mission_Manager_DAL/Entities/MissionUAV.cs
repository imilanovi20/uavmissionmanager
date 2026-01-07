using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class MissionUAV
    {
        public int MissionId { get; set; }
        public int UAVId { get; set; }

        public Mission Mission { get; set; }
        public UAV UAV { get; set; }
    }

    public class MissionUAVConfigurationBuilder : IEntityTypeConfiguration<MissionUAV>
    {
        public void Configure(EntityTypeBuilder<MissionUAV> builder)
        {
            builder.HasKey(mu => new { mu.MissionId, mu.UAVId });

            builder.HasOne(mu => mu.Mission)
                   .WithMany(m => m.MissionUAVs)
                   .HasForeignKey(mu => mu.MissionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(mu => mu.UAV)
                   .WithMany(u => u.MissionUAVs)
                   .HasForeignKey(mu => mu.UAVId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
