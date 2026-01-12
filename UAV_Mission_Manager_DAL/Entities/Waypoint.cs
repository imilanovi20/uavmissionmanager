using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class Waypoint
    {
        public int Id { get; set; }
        public int MissionId { get; set; }
        public int OrderIndex { get; set; } 
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Navigation properties
        public Mission Mission { get; set; }
        public ICollection<MissionTask> Tasks { get; set; } = new List<MissionTask>();
    }

    public class WaypointConfigurationBuilder : IEntityTypeConfiguration<Waypoint>
    {
        public void Configure(EntityTypeBuilder<Waypoint> builder)
        {
            builder.HasKey(w => w.Id);

            builder.Property(w => w.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(w => w.OrderIndex)
                   .IsRequired();

            builder.Property(w => w.Latitude)
                   .HasPrecision(10, 7)
                   .IsRequired();

            builder.Property(w => w.Longitude)
                   .HasPrecision(10, 7)
                   .IsRequired();

            builder.HasOne(w => w.Mission)
                   .WithMany(m => m.Waypoints)
                   .HasForeignKey(w => w.MissionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}