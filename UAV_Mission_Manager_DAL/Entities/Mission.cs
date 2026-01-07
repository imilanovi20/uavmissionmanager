using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace UAV_Mission_Manager_DAL.Entities
{
    public class Mission
    {
        public int Id { get; set; }
        public double LocationLat { get; set; }
        public double LocationLon { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        //public string CreatedBy { get; set; }
        public ICollection<MissionUAV> MissionUAVs { get; set; } = new List<MissionUAV>();
        public ICollection<MissionUser> MissionUsers { get; set; } = new List<MissionUser>();
        // public ICollection<Waypoint> Waypoints { get; set; } = new List<Waypoint>();
        public WeatherData? WeatherData { get; set; }
    }

    public class MissionConfigurationBuilder : IEntityTypeConfiguration<Mission>
    {
        public void Configure(EntityTypeBuilder<Mission> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(m => m.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(m => m.Date)
                   .IsRequired();

            builder.Property(m => m.Description)
                   .HasMaxLength(1000);

            builder.Property(m => m.CreatedAt)
                   .IsRequired();

            builder.HasOne(m => m.WeatherData)
                   .WithOne(wd => wd.Mission)
                   .HasForeignKey<WeatherData>(wd => wd.MissionId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
