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
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        //Weather Data Properties
        public double Temperature { get; set; }
        public double WindSpeed { get; set; }
        public string WindDirection { get; set; }
        public bool IsSafeForFlight { get; set; }
        public int WeatherCode { get; set; }
        //Flight Category Property
        public string OperationCategory { get; set; }
        public double HeviestUAV { get; set; }
        public string UAVOperationClass { get; set; }
        public string ZoneOperationClass { get; set; }
        public bool IsRecordingPermissionRequired { get; set; }
        public bool CrossesAirspace { get; set; }
        public string CrossesAirspaceMessage { get; set; }
        public string? Violations { get; set; }
        //Battery status properties
        public string ProjectedFlightTime { get; set; }
        public string FlightTimeUAV { get; set; }
        //Obstacle and optimal route properties
        public string OptimalRoute { get; set; }
        public string CreatedByUsername { get; set; }
        public ICollection<MissionUAV> MissionUAVs { get; set; } = new List<MissionUAV>();
        public ICollection<MissionUser> MissionUsers { get; set; } = new List<MissionUser>();
        public ICollection<Waypoint> Waypoints { get; set; } = new List<Waypoint>();
        public ICollection<Formation> Formations { get; set; } = new List<Formation>();
        public ICollection<MissionObstacle> MissionObstacles { get; set; } = new List<MissionObstacle>();
        public User CreatedBy { get; set; }
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

            builder.Property(m => m.Temperature)
                .HasColumnType("DECIMAL(5,2)");

            builder.Property(m => m.WindSpeed)
                .HasColumnType("DECIMAL(5,2)");

            builder.Property(m => m.FlightTimeUAV)
                .HasColumnType("NVARCHAR(MAX)");

            builder.Property(m => m.Violations)
                .HasColumnType("NVARCHAR(MAX)");

            builder.Property(m => m.OptimalRoute)
                .HasColumnType("NVARCHAR(MAX)");

            builder.HasOne(m => m.CreatedBy)
                .WithMany()
                .HasForeignKey(m => m.CreatedByUsername)
                .OnDelete(DeleteBehavior.Restrict); 

        }
    }
}
